const express = require('express');
const router = express.Router();
const pool = require('../pool');

router.get('/', async (req, res) => {  // Get all customers
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM Customers');
      conn.release();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {  // Get 1 customer
    try {
        const customerId = req.params.id;
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM Customers WHERE id = ?', [customerId]);
        conn.release();

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Customer not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {  // Add 1 customer
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
        [firstName,
            surName,
            email,
            phoneNumber,
            homeAddress,
            homeCountry]
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

router.patch('/:id', async (req, res) => {  // Update 1
  const customerId = req.params.id;

  const {  // Extract fields from the request body that can be updated
    firstName,
    surName,
    email,
    phoneNumber,
    homeAddress,
    homeCountry
  } = req.body;

  if (!firstName && !surName && !email && !phoneNumber && !homeAddress && !homeCountry) {  // Extract fields from the request body that can be updated
    return res.status(400).json({
      error: 'At least one field is required for updating'
    });
  }

  try {
    const conn = await pool.getConnection();

    const updateFields = [];  // Build the SQL UPDATE query based on the provided fields
    const updateValues = [];

    if (firstName) {
      updateFields.push('firstName = ?');
      updateValues.push(firstName);
    }
    if (surName) {
      updateFields.push('surName = ?');
      updateValues.push(surName);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (phoneNumber) {
      updateFields.push('phoneNumber = ?');
      updateValues.push(phoneNumber);
    }
    if (homeAddress) {
      updateFields.push('homeAddress = ?');
      updateValues.push(homeAddress);
    }
    if (homeCountry) {
      updateFields.push('homeCountry = ?');
      updateValues.push(homeCountry);
    }

    const updateQuery = `UPDATE Customers SET ${updateFields.join(', ')} WHERE id = ?`;

    const result = await conn.query(
      updateQuery,
      [...updateValues, customerId]
    );

    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Customer not found'
      });
    }

    res.json({
      message: 'Customer updated successfully'
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

router.delete('/:id', async (req, res) => {  // Delete 1
  const customerId = req.params.id;

  try {
    const conn = await pool.getConnection();

    const result = await conn.query(
      'DELETE FROM Customers WHERE id = ?', [customerId]
    );

    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Customer not found'
      });
    }

    res.json({
      message: 'Customer deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;