const request = require('supertest');
const app = require('../app');
const pool = require('../dao/db'); // Imports the database connection

describe('OQM-17: POST /api/v1/tickets Integration Tests', () => {
  let testServiceId;

  // 1. SETUP: Clean the database and insert a dummy service before tests run
  beforeAll(async () => {
    // Wipe existing data to prevent ID conflicts
    await pool.query('DELETE FROM ticket');
    await pool.query('DELETE FROM counter_service');
    await pool.query('DELETE FROM counter');
    await pool.query('DELETE FROM service');

    // Insert a valid service so we have a real UUID to send in our POST request
    const insertQuery = `
      INSERT INTO service (name, avg_time) 
      VALUES ('Integration Test Service', 300) 
      RETURNING id_service;
    `;
    const res = await pool.query(insertQuery);
    testServiceId = res.rows[0].id_service; // Save the UUID for the tests
  });

  // 2. TEARDOWN: Clean up and close the database connection so Jest doesn't hang
  afterAll(async () => {
    await pool.query('DELETE FROM ticket');
    await pool.query('DELETE FROM service');
    await pool.end(); 
  });

  // 3. TEST: Success case
  test('Should successfully create a new ticket (201)', async () => {
    const response = await request(app)
      .post('/api/v1/tickets')
      .send({ id_service: testServiceId }); // Using the real UUID we seeded

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id_ticket');
    expect(response.body).toHaveProperty('number');
    expect(response.body.state).toBe('PENDING'); 
  });

  // 4. TEST: Bad Request (Missing payload)
  test('Should fail if id_service is missing (400/422)', async () => {
    const response = await request(app)
      .post('/api/v1/tickets')
      .send({}); // Empty payload

    // Depending on how your teammate configured express-validator, this could be 400 or 422
    expect(response.status).toBeGreaterThanOrEqual(400); 
    expect(response.body).toHaveProperty('error'); // Or 'errors' array if using express-validator
  });

  // 5. TEST: Not Found (Fake UUID)
  test('Should fail if id_service does not exist (404)', async () => {
    const fakeUuid = '123e4567-e89b-12d3-a456-426614174000';
    const response = await request(app)
      .post('/api/v1/tickets')
      .send({ id_service: fakeUuid });

    expect(response.status).toBe(404);
  });
});