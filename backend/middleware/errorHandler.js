'use strict';

function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Route not found' });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // Body that is not valid JSON (thrown by express.json())
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON body' });
  }

  // Unexpected error: log it on the server, send nothing internal to the client
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}

function validateRequest(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let error = "The parameters are not formatted properly\n\n"
    errors.array().forEach((e) => {
      error += "- Parameter: **" + e.param + "** - Reason: *" + e.msg + "* - Location: *" + e.location + "*\n\n"
    })
    return res.status(422).json({ error: error })
  }
  return next()
}

module.exports = { notFoundHandler, errorHandler, validateRequest };