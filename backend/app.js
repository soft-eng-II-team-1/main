const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const baseUrl = "/api/v1";
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());

app.get(baseUrl + "/test", (req, res) => {
    res.status(200).send({ message: "Hello from backend" });
});

module.exports = app