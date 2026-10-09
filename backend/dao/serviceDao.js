'use strict';

const pool = require('./db');

//returns all services, ordered by name
async function getServices() {
    const { rows} = await pool.query(
        'SELECT id_service, name FROM service ORDER BY name'
    );

    return rows.map((row) => ({id: row.id_service, name: row.name}));
}

module.exports = {getServices};