const express = require('express');
const mariaDB = require('mariadb');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
let pool

try {
  pool = mariaDB.createPool({host: 'localhost', user: 'admin', password: 'admin123', database: 'BookingSystem', connectionLimit: 5});
}
catch (err) {
  console.error("Error creating mariaDB pool:", err)
}

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Define routes
app.get('/customers', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM Customers');
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/customers', async (req, res) => {
  const {
    firstName,
    surName,
    email,
    phoneNumber,
    homeAddress,
    homeCountry
  } = req.body;

  if (!firstName || !surName || !email || !phoneNumber || !homeAddress || !homeCountry) {
    return res.status(400).json({
      error: 'All fields are required'
    });
  }

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO Customers (firstName, surName, email, phoneNumber, homeAddress, homeCountry) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, surName, email, phoneNumber, homeAddress, homeCountry]
    );
    conn.release();

    const insertId = Number(result.insertId);

    res.json({
      id: insertId,
      firstName,
      surName,
      email,
      phoneNumber,
      homeAddress,
      homeCountry
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

app.listen(port, () => {  // Start the server
  console.log(`Server is listening on port ${port}`);
});
