const express = require('express');
const router = express.Router();
const pool = require('../pool');

router.get('/', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM CampingSpots');
      conn.release();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const spotId = req.params.id;
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM CampingSpots WHERE id = ?', [spotId]);
        conn.release();

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Spot not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
  
router.post('/', async (req, res) => {
    const {
      spotName,
      spotSize,
      pricePerDay
    } = req.body;

    if (!spotName || !spotSize || !pricePerDay) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO CampingSpots (spotName, spotSize, pricePerDay) VALUES (?, ?, ?)',
        [spotName,
            spotSize,
            pricePerDay]
      );
      conn.release();
  
      const insertId = Number(result.insertId);
  
      res.json({
        id: insertId,
        spotName,
        spotSize,
        pricePerDay
      });
    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
});

module.exports = router;