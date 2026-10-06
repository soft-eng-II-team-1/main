const request = require('supertest');
const app = require('../app');

describe('Suite di prova - API Endpoints', () => {

    describe('GET /api/test', () => {
        test('Dovrebbe restituire status 200 e stato OK', async () => {
            const response = await request(app).get('/api/v1/test');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: "Hello from backend"
            });
        });
    });

});