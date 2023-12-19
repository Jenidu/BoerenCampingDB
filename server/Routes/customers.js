const express = require('express');
const router = express.Router();
const pool = require('../pool');

router.get('/', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM Customers');
      conn.release();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
router.post('/', async (req, res) => {
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

module.exports = router;