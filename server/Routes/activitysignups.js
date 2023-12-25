const express = require('express');
const router = express.Router();
const pool = require('../pool');

router.get('/', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM ActivitySignups');
      conn.release();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    const {
      activityID,
      customerID,
      adults,
      children
    } = req.body;

    if (!activityID || !customerID || !adults || !children) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO ActivitySignups (activityID, customerID, adults, children) VALUES (?, ?, ?, ?)',
        [activityID,
            customerID,
            adults,
            children]
      );
      conn.release();

      res.json({
        activityID,
        customerID,
        adults,
        children
      });
    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
});

module.exports = router;