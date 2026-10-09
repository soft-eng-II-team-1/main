'use strict';

const express = require('express');
const { body } = require('express-validator');
const ticketDao = require('../dao/ticketDao');

const { validateRequest } = require('../middleware/errorHandler');

const router = express.Router();

//body is read only if the request has JSON content type
function requireJson(req, res, next) {
  if (!req.is('application/json')) {
    return res.status(415).json({ error: 'Content-Type must be application/json' });
  }
  return next();
}

const createTicketValidation = [
  body('serviceId')
    .exists({ values: 'falsy' }).withMessage('serviceId is required')
    .bail()
    .isUUID().withMessage('serviceId must be a valid UUID'),
];

// POST /api/v1/tickets
router.post('/', requireJson, createTicketValidation, validateRequest, async (req, res) => {
  /*const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: 'Validation failed',
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }*/

  const ticket = await ticketDao.createTicket(req.body.serviceId);
  if (ticket === null) {
    return res.status(404).json({ error: 'Service not found' });
  }

  return res.status(201).json(ticket);
});

// GET /api/v1/tickets/queues
router.get('/queues', async (req, res, next) => {
  try {
    const queues = await ticketDao.getQueues();
    return res.status(200).json(queues);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
