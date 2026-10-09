'use strict';

const pool = require('./db');

const {getQueues} = require('./ticketDao');

// arbitrary constant for locking
const CALL_NEXT_LOCK_KEY = 1002;

//calls the next costumer to the given counter
//the ticket called before by the same counter is marked as served

/* The queue is chosen among the services the counter can serve: longest
one wins and, if two queues have the same length, the one with the lowest average time
The first ticket of that queue (the oldest) becomes CALLED and is assigned to the counter */

async function callNextTicket(counterId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const counterResult = await client.query(
            'SELECT id_counter, number FROM counter WHERE id_counter = $1',
            [counterId]
        );

        if(counterResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return {ticket: null, error: `Counter ${counterId} not found`};
        }

        const counter = counterResult.rows[0];

        //lock to avoid conflict (two counters calling the same ticket)
        //released automatically at commit/rollback
        await client.query('SELECT pg_advisory_xact_lock($1)', [CALL_NEXT_LOCK_KEY]);

        //sets last ticket as served from called
        await client.query(
            `UPDATE ticket
            SET state = 'SERVED', serve_timestamp = NOW()
            WHERE id_counter = $1 AND state = 'CALLED' AND issue_date = CURRENT_DATE`,
            [counterId]
        );

        //services that counter can serve
        const counterServices = await client.query(
            `SELECT s.name 
            FROM counter_service c INNER JOIN service s ON c.id_service = s.id_service
            WHERE c.id_counter = $1`,
            [counterId]
        );

        const allowedServices = new Set(counterServices.rows.map((row) => row.name));

        //get current queues
        const queues = await getQueues(client);

        //find longest queue, if 2 have the same lenght the one with the lowest service time
        let chosenService = null;
        for (const [service, queue] of Object.entries(queues)) {
            if (!allowedServices.has(service) || queue.tickets.length === 0) {
                continue;
            }

            if (chosenService === null) {
                chosenService = service;
                continue;
            }

            const chosenQueue = queues[chosenService];

            const isLonger = queue.tickets.length > chosenQueue.tickets.length;
            const isFaster = queue.tickets.length === chosenQueue.tickets.length && queue.avgTime < chosenQueue.avgTime;
            
            if (isLonger || isFaster) {
                chosenService = service;
            }
        }

        if(chosenService === null) {
            await client.query('COMMIT');
            return {ticket: null, error: null};
        }

        const chosenQueue = queues[chosenService];
        const oldestTicket = chosenQueue.tickets[0];

        //ticket becomes called and goes to the counter
        const updateResult = await client.query(
            `UPDATE ticket
            SET state = 'CALLED', id_counter = $1
            WHERE id_ticket = $2 AND state = 'PENDING'
            RETURNING id_ticket, number, state`,
            [counterId, oldestTicket.id]
        );
        
        await client.query('COMMIT');

        if (updateResult.rowCount === 0) {
            return { ticket: null, error: null };
        }

        const ticket = updateResult.rows[0];
        return {
            ticket: {
                id: ticket.id_ticket,
                number: ticket.number,
                state: ticket.state,
                serviceName: chosenService,
                counterId: counter.id_counter,
                counterNumber: counter.number,
                issuedAt: oldestTicket.issuedAt,
            },
            error: null,
            };
    } catch (err) {
        await rollbackQuietly(client);
        throw err;
    } finally {
        client.release();
    }
}

async function getCounterById(counterId){
    const client = await pool.connect();
    try {
        const result = await client.query(
            'SELECT id_counter, number FROM counter WHERE id_counter = $1',
            [counterId]
        );

        if(result.rowCount === 0) {
            return null;
        }

        return result.rows[0];
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
  } catch (rollbackErr) {
    console.error('Rollback failed:', rollbackErr);
  }
}

module.exports = { callNextTicket, getCounterById };
