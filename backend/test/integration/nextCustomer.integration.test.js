'use strict';

require('dotenv').config();
process.env.DB_USER = process.env.DB_USER || 'postgres';
process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
process.env.DB_NAME = process.env.DB_NAME || 'OfficeQueueManagement';

const request = require('supertest');
const app = require('../../app');
const pool = require('../../dao/db');

describe('Integration Tests: GET /api/v1/counters/:counterId/next', () => {
  const validNonExistentId = '00000000-0000-0000-0000-000000000000';

  // Helper function to clean the database between tests
  async function cleanDatabase() {
    await pool.query('DELETE FROM ticket');
    await pool.query('DELETE FROM counter_service');
    await pool.query('DELETE FROM counter');
    await pool.query('DELETE FROM service');
  }

  // Helper functions to seed test data
  async function createService(name, avgTime) {
    const res = await pool.query(
      'INSERT INTO service (name, avg_time) VALUES ($1, $2) RETURNING id_service, name, avg_time',
      [name, avgTime]
    );
    return res.rows[0];
  }

  async function createCounter(number) {
    const res = await pool.query(
      'INSERT INTO counter (number) VALUES ($1) RETURNING id_counter, number',
      [number]
    );
    return res.rows[0];
  }

  async function linkCounterService(counterId, serviceId) {
    await pool.query(
      'INSERT INTO counter_service (id_counter, id_service) VALUES ($1, $2)',
      [counterId, serviceId]
    );
  }

  async function createTicket({
    number,
    state = 'PENDING',
    serviceId,
    counterId = null,
    issueTimestamp = new Date(),
    serveTimestamp = null
  }) {
    const res = await pool.query(
      `INSERT INTO ticket (number, state, issue_date, issue_timestamp, serve_timestamp, id_service, id_counter)
       VALUES ($1, $2, CURRENT_DATE, $3, $4, $5, $6)
       RETURNING id_ticket, number, state, issue_timestamp, serve_timestamp`,
      [number, state, issueTimestamp, serveTimestamp, serviceId, counterId]
    );
    return res.rows[0];
  }

  beforeAll(async () => {
    await cleanDatabase();
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await cleanDatabase();
    await pool.end();
  });

  // 422 - counterID parameter is not a valid UUID
  test('422 - counterID parameter is not a valid UUID', async () => {
    const response = await request(app).get('/api/v1/counters/invalid-uuid-123/next');

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('error');
  });

  // 404 - Counter is not in the system
  test('404 - Counter is not in the system', async () => {
    const response = await request(app).get(`/api/v1/counters/${validNonExistentId}/next`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Counter not found' });
  });

  // 200 - Counter is in the system, but no tickets are waiting for the counter's services (empty queue)
  test('200 - Counter is in the system, but no tickets are waiting for the counter\'s services (empty queue)', async () => {
    const counter = await createCounter(1);
    const service = await createService('Shipping', 300);
    await linkCounterService(counter.id_counter, service.id_service);

    const response = await request(app).get(`/api/v1/counters/${counter.id_counter}/next`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
  });

  // 200 - Call next ticket successfully (FIFO order)
  test('200 - Call next ticket successfully (FIFO order)', async () => {
    const counter = await createCounter(1);
    const service = await createService('Shipping', 300);
    await linkCounterService(counter.id_counter, service.id_service);

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const ticket1 = await createTicket({
      number: '1',
      serviceId: service.id_service,
      issueTimestamp: tenMinutesAgo
    });
    const ticket2 = await createTicket({
      number: '2',
      serviceId: service.id_service,
      issueTimestamp: fiveMinutesAgo
    });

    const response = await request(app).get(`/api/v1/counters/${counter.id_counter}/next`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: ticket1.id_ticket,
      number: '1',
      state: 'CALLED',
      serviceId: service.id_service,
      serviceName: 'Shipping',
      issuedAt: expect.any(String)
    });

    // Verifica persistenza su database
    const dbTicket1 = await pool.query('SELECT * FROM ticket WHERE id_ticket = $1', [ticket1.id_ticket]);
    expect(dbTicket1.rows[0].state).toBe('CALLED');
    expect(dbTicket1.rows[0].id_counter).toBe(counter.id_counter);

    const dbTicket2 = await pool.query('SELECT * FROM ticket WHERE id_ticket = $1', [ticket2.id_ticket]);
    expect(dbTicket2.rows[0].state).toBe('PENDING');
    expect(dbTicket2.rows[0].id_counter).toBeNull();
  });

  // 200 - Priority to queue with more tickets waiting
  test('200 - Priority to queue with more tickets waiting', async () => {
    const counter = await createCounter(1);
    const serviceShipping = await createService('Shipping', 300);
    const serviceAccounts = await createService('Accounts', 600);
    await linkCounterService(counter.id_counter, serviceShipping.id_service);
    await linkCounterService(counter.id_counter, serviceAccounts.id_service);

    // Shipping has 1 ticket
    await createTicket({
      number: '1',
      serviceId: serviceShipping.id_service,
      issueTimestamp: new Date(Date.now() - 15 * 60 * 1000)
    });

    // Accounts has 2 ticket (longer queue)
    const accountsTicket1 = await createTicket({
      number: '2',
      serviceId: serviceAccounts.id_service,
      issueTimestamp: new Date(Date.now() - 10 * 60 * 1000)
    });
    await createTicket({
      number: '3',
      serviceId: serviceAccounts.id_service,
      issueTimestamp: new Date(Date.now() - 5 * 60 * 1000)
    });

    const response = await request(app).get(`/api/v1/counters/${counter.id_counter}/next`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(accountsTicket1.id_ticket);
    expect(response.body.serviceName).toBe('Accounts');
    expect(response.body.state).toBe('CALLED');
  });

  // 200 - When queue lengths are equal, priority is given to the service with the lower avg_time
  test('200 - When queue lengths are equal, priority is given to the service with the lower avg_time', async () => {
    const counter = await createCounter(1);
    const fastService = await createService('Fast Service', 200);
    const slowService = await createService('Slow Service', 500);
    await linkCounterService(counter.id_counter, fastService.id_service);
    await linkCounterService(counter.id_counter, slowService.id_service);

    // Both services have exactly 1 ticket in queue
    const fastTicket = await createTicket({
      number: '1',
      serviceId: fastService.id_service,
      issueTimestamp: new Date(Date.now() - 5 * 60 * 1000)
    });
    await createTicket({
      number: '2',
      serviceId: slowService.id_service,
      issueTimestamp: new Date(Date.now() - 10 * 60 * 1000)
    });

    const response = await request(app).get(`/api/v1/counters/${counter.id_counter}/next`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(fastTicket.id_ticket);
    expect(response.body.serviceName).toBe('Fast Service');
    expect(response.body.state).toBe('CALLED');
  });

  // 200 - Previously CALLED ticket for the same counter becomes SERVED with timestamp
  test('200 - Previously CALLED ticket for the same counter becomes SERVED with timestamp', async () => {
    const counter = await createCounter(1);
    const service = await createService('Shipping', 300);
    await linkCounterService(counter.id_counter, service.id_service);

    // Previously called ticket from the same counter
    const previousCalledTicket = await createTicket({
      number: '1',
      state: 'CALLED',
      serviceId: service.id_service,
      counterId: counter.id_counter,
      issueTimestamp: new Date(Date.now() - 30 * 60 * 1000)
    });

    // New ticket in queue
    const nextPendingTicket = await createTicket({
      number: '2',
      state: 'PENDING',
      serviceId: service.id_service,
      issueTimestamp: new Date(Date.now() - 5 * 60 * 1000)
    });

    const response = await request(app).get(`/api/v1/counters/${counter.id_counter}/next`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(nextPendingTicket.id_ticket);
    expect(response.body.state).toBe('CALLED');

    // Verify that the previously called ticket is now SERVED with serve_timestamp set
    const dbPrevious = await pool.query('SELECT * FROM ticket WHERE id_ticket = $1', [previousCalledTicket.id_ticket]);
    expect(dbPrevious.rows[0].state).toBe('SERVED');
    expect(dbPrevious.rows[0].serve_timestamp).not.toBeNull();
  });

  // 200 - Ignore tickets in queue belonging to services not managed by this counter
  test('200 - Ignore tickets in queue belonging to services not managed by this counter', async () => {
    const counter = await createCounter(1);
    const serviceShipping = await createService('Shipping', 300);
    const serviceOther = await createService('Other Service', 400);

    // Counter handles only Shipping
    await linkCounterService(counter.id_counter, serviceShipping.id_service);

    // Ticket pending only for Other Service
    const otherTicket = await createTicket({
      number: '1',
      serviceId: serviceOther.id_service
    });

    const response = await request(app).get(`/api/v1/counters/${counter.id_counter}/next`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});

    // The ticket for Other Service should not have been modified
    const dbOther = await pool.query('SELECT * FROM ticket WHERE id_ticket = $1', [otherTicket.id_ticket]);
    expect(dbOther.rows[0].state).toBe('PENDING');
    expect(dbOther.rows[0].id_counter).toBeNull();
  });
});
