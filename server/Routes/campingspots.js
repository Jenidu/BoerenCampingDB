const express = require('express');
const router = express.Router();
const pool = require('../pool');

router.get('/', async (req, res) => {  // Get all camping spots
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM CampingSpots');
      conn.release();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.get('/:id', async (req, res) => {  // Get 1 camping spot
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
  
router.post('/', async (req, res) => {  // Add 1 camping spot
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

router.patch('/:id', async (req, res) => {  // Update 1
  const spotId = req.params.id;

  const {  // Extract fields from the request body that can be updated
    spotName,
    spotSize,
    pricePerDay
  } = req.body;

  if (!spotName && !spotSize && !pricePerDay) {  // Extract fields from the request body that can be updated
    return res.status(400).json({
      error: 'At least one field is required for updating'
    });
  }

  try {
    const conn = await pool.getConnection();

    const updateFields = [];  // Build the SQL UPDATE query based on the provided fields
    const updateValues = [];

    if (spotName) {
      updateFields.push('spotName = ?');
      updateValues.push(spotName);
    }
    if (spotSize) {
      updateFields.push('spotSize = ?');
      updateValues.push(spotSize);
    }
    if (pricePerDay) {
      updateFields.push('pricePerDay = ?');
      updateValues.push(pricePerDay);
    }

    const updateQuery = `UPDATE CampingSpots SET ${updateFields.join(', ')} WHERE id = ?`;

    const result = await conn.query(
      updateQuery,
      [...updateValues, spotId]
    );

    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Spot not found'
      });
    }

    res.json({
      message: 'Spot updated successfully'
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  const spotId = req.params.id;

  try {
    const conn = await pool.getConnection();

    const result = await conn.query(
      'DELETE FROM CampingSpots WHERE id = ?', [spotId]
    );

    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Spot not found'
      });
    }

    res.json({
      message: 'Spot deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;