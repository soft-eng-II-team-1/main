"use strict";

const express = require('express');
const { param } = require('express-validator');
const counterDao = require('../dao/counterDao');
const { validateRequest } = require('./middleware/errorHandler');

const router = express.Router();

const checkCounterId = [
    param('counterId')
        .exists({ values: 'falsy' }).withMessage('counterId is required')
        .bail()
        .isUUID().withMessage('counterId must be a valid UUID'),
];

// GET /api/v1/counters/:counterId/next
router.get('/:counterId/next', checkCounterId, validateRequest, async (req, res, next) => {
    try {
        const counterId = counterDao.getCounterById(req.params.counterId);

        if (counterId === null) {
            return res.status(404).json({ error: 'Counter not found' });
        }

        const ticket = await counterDao.callNextTicket(counterId);
        return res.status(200).json(ticket);
    } catch (err) {
        return next(err);
    }
});

module.exports = router;