const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const servicesRouter = require('./routes/services');
const ticketsRouter = require('./routes/tickets');
const countersRouter = require('./routes/counters');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const app = express();

const baseUrl = "/api/v1";
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());

app.get(baseUrl + "/test", (req, res) => {
    res.status(200).send({ message: "Hello from backend" });
});

app.use(baseUrl + "/services", servicesRouter);
app.use(baseUrl + "/tickets", ticketsRouter);
app.use(baseUrl + "/counters", countersRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app