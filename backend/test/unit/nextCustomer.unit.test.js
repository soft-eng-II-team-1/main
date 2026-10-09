'use strict';

jest.mock('../../dao/db', () => ({
  query: jest.fn(),
  pool: {}
}));

jest.mock('../../dao/counterDao');

const request = require('supertest');
const app = require('../../app');
const counterDao = require('../../dao/counterDao');

describe('Unit Tests: GET /api/v1/counters/:counterId/next', () => {
  const validCounterId = 'c0a80101-1234-4bc1-9abc-123456789abc';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 422 - counterID parameter is not a valid UUID
  test('422 - counterID parameter is not a valid UUID', async () => {
    const response = await request(app).get('/api/v1/counters/invalid-uuid-123/next');

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty('error');
    expect(counterDao.getCounterById).not.toHaveBeenCalled();
  });

  // 404 - Counter is not in the system
  test('404 - Counter is not in the system', async () => {
    counterDao.getCounterById.mockResolvedValue(null);

    const response = await request(app).get(`/api/v1/counters/${validCounterId}/next`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Counter not found' });
    expect(counterDao.getCounterById).toHaveBeenCalledWith(validCounterId);
    expect(counterDao.callNextTicket).not.toHaveBeenCalled();
  });

  // 200 - No tickets waiting for this counter's services
  test("200 - No tickets waiting for this counter's services", async () => {
    counterDao.getCounterById.mockResolvedValue({ id_counter: validCounterId, number: 1 });
    counterDao.callNextTicket.mockResolvedValue({});

    const response = await request(app).get(`/api/v1/counters/${validCounterId}/next`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({});
    expect(counterDao.callNextTicket).toHaveBeenCalledWith(validCounterId);
  });

  // 200 - Next ticket call successful
  test('200 - Next ticket call successful', async () => {
    const mockTicket = {
      id: '22222222-2222-2222-2222-222222222222',
      number: '1',
      state: 'CALLED',
      serviceId: '11111111-1111-1111-1111-111111111111',
      serviceName: 'Shipping',
      issuedAt: new Date().toISOString()
    };

    counterDao.getCounterById.mockResolvedValue({ id_counter: validCounterId, number: 1 });
    counterDao.callNextTicket.mockResolvedValue(mockTicket);

    const response = await request(app).get(`/api/v1/counters/${validCounterId}/next`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTicket);
  });

  // 500 - Unexpected error during DAO execution
  test('500 - Unexpected error during DAO execution', async () => {
    counterDao.getCounterById.mockRejectedValue(new Error('Database query failure'));

    const response = await request(app).get(`/api/v1/counters/${validCounterId}/next`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
  });
});
