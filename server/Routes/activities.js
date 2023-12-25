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

router.get('/:id', async (req, res) => {
    try {
        const activityId = req.params.id;
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM Activities WHERE id = ?', [activityId]);
        conn.release();

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Activity not found' });
        }
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
      
      const insertId = Number(result.insertId);

      res.json({
        id: insertId,
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