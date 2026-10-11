const request = require('supertest');
const app = require('../app'); // Imports your Express server

describe('OQM-17: POST /api/v1/tickets', () => {
    
    test('Should successfully create a new ticket for a valid service', async () => {
        // 1. Arrange: Define the payload (assuming you have a seeded service ID in your test DB)
        const payload = { id_service: "existing-uuid-from-db" };

        // 2. Act: Simulate the POST request
        const response = await request(app)
            .post('/api/v1/tickets')
            .send(payload);

        // 3. Assert: Check the results
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id_ticket');
        expect(response.body).toHaveProperty('number');
        expect(response.body.state).toBe('PENDING');
    });

    test('Should return 400 if id_service is missing', async () => {
        const response = await request(app)
            .post('/api/v1/tickets')
            .send({}); // Empty payload

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});