const express = require('express');
const router = express.Router();
const pool = require('../pool');

router.get('/', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM Activities');
      conn.release();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router.post('/', async (req, res) => {
    const {
      activityID,
      startDate,
      endDate
    } = req.body;
    const totalAduls = 0  // When activity is first created there are no participants
    const totalChildren = 0

    if (!activityID || !startDate || !endDate) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO Activities (activityID, totalAduls, totalChildren, startDate, endDate) VALUES (?, ?, ?, ?, ?)',
        [activityID,
            totalAduls,
            totalChildren,
            startDate,
            endDate]
      );
      conn.release();
  
      res.json({
        activityID,
            totalAduls,
            totalChildren,
            startDate,
            endDate
      });
    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  });

module.exports = router;