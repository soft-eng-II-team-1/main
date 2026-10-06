'use strict';

const pool = require('./db');

//all the ticket creations compete for the same lock
const TICKET_NUM_LOCK_KEY = 1001;

//creates a ticket in state PENDING, the numbe ris a unique progressive integer

async function createTicket(serviceId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        //FOR SHARE prevent service from being deleted before the insert
        const serviceResult = await client.query(
            `SELECT id_service, name
            FROM service
            WHERE id_service = $1 FOR SHARE`,
            [serviceId]
        );
        if(serviceResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return null;
        }
        const service = serviceResult.rows[0];

        await client.query('SELECT pg_advisory_xact_lock($1)', [TICKET_NUM_LOCK_KEY]);

        const numberResult =  await client.query(
            `SELECT COALESCE(MAX(number::int), 0) + 1 AS next_number
            FROM ticket
            WHERE issue_date = CURRENT_DATE`
        );

        const nextNumber = String(numberResult.rows[0].next_number);

        const insertTicket = await client.query(
            `INSERT INTO ticket (number,state, id_service)
            VALUES($1, 'PENDING', $2)
            RETURNING id_ticket, number, state, issue_timestamp`,
            [nextNumber, serviceId]
        );

        await client.query('COMMIT');

        const ticket = insertTicket.rows[0];

        return{
            id: ticket.id_ticket,
            number: ticket.number,
            state: ticket.state,
            serviceId: service.id_service,
            serviceName: service.name,
            issuedAt: ticket.issue_timestamp.toISOString(),
        };
    } catch (err) {
        await rollbackQuietly(client);
        throw err;
    } finally {
        client.release();
    }
}

async function rollbackQuietly(client) {
    try {
        await client.query('ROLLBACK');
    } catch(rollbackErr) {
        console.error('Rollback failed:', rollbackErr);
    }
}

module.exports = {createTicket};