const express = require('express');
const router = express.Router();
const pool = require('../pool');

router.get('/', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM ActivitiesInfo');
      conn.release();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

router.post('/', async (req, res) => {
    const {
        activityName,
        discription,
        IMG_path,
        startTime,
        EndTime,
        maxPersons
    } = req.body;

    if (!activityName || !maxPersons) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO ActivitiesInfo (activityName, discription, IMG_path, startTime, EndTime, maxPersons) VALUES (?, ?, ?, ?, ?, ?)',
        [activityName,
            discription,
            IMG_path,
            startTime,
            EndTime,
            maxPersons]
      );
      conn.release();
  
      const insertId = Number(result.insertId);
  
      res.json({
        id: insertId,
        activityName,
        discription,
        IMG_path,
        startTime,
        EndTime,
        maxPersons
      });
    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
  });

module.exports = router;