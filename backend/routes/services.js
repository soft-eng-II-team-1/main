'use strict';

const express = require('express');
const serviceDao = require('../dao/serviceDao');

const router = express.Router();

// GET /api/v1/services
router.get('/', async (req,res) => {
    try {
        const services = await serviceDao.getServices();
        res.status(200).json(services);
    } catch (err) {
        next(err);
    }
});

module.exports = router;