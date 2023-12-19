const express = require('express');
const bodyParser = require('body-parser');
const customersRouter = require('./Routes/customers');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());  // Middleware to parse JSON requests

app.use('/customers', customersRouter);

app.listen(port, () => {  // Start the server
  console.log(`Server is listening on port ${port}`);
});
