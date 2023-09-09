const functions = require("firebase-functions");
require('dotenv').config('./.env');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const Todos = require('./todos');

const app = express();

const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

app.get('/api', (req, res) => {
  res.send('Api is listening.')
});

app.use('/api/todos', Todos);

app.listen(8081, () => {
  console.log(`Listening on http://localhost:${port}/api`);
})

exports.app = functions.https.onRequest(app);