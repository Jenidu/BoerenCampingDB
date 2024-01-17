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

router.get('/search', async (req, res)  => {  // Search camping spots
  try {
      const queryParams = req.query;

      if (Object.keys(queryParams).length > 0) {  // If query parameters are present, construct a dynamic query
          const conn = await pool.getConnection();
          const keys = Object.keys(queryParams);
          const values = Object.values(queryParams);

          const query = `SELECT * FROM CampingSpots WHERE ${keys.map(key => `${key} = ?`).join(' AND ')}`;
          const rows = await conn.query(query, values);

          conn.release();

          if (rows.length > 0) {
              res.json(rows);
          } else {
              res.status(404).json({ error: 'No matching camping spots found' });
          }
      } else {
          res.status(400).json({ error: 'Invalid request. Provide query parameters.' });
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {  // Add 1 camping spot
    const {
      spotName,
      spotType,
      pricePerDay
    } = req.body;

    if (!spotName || !spotType || pricePerDay === undefined) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO CampingSpots (spotName, spotType, pricePerDay) VALUES (?, ?, ?)',
        [spotName,
          spotType,
            pricePerDay]
      );
      conn.release();
  
      const insertId = Number(result.insertId);
  
      res.json({
        id: insertId,
        spotName,
        spotType,
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
    spotType,
    pricePerDay
  } = req.body;

  if (!spotName && !spotType && pricePerDay === undefined) {  // Extract fields from the request body that can be updated
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
    if (spotType) {
      updateFields.push('spotType = ?');
      updateValues.push(spotType);
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