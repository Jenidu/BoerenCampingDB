const express = require('express');
const router = express.Router();
const pool = require('../pool');

router.get('/', async (req, res) => {  // Get all activity types
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM ActivityTypes');
      conn.release();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.get('/search', async (req, res)  => {  // Search customers
  try {
      const queryParams = req.query;

      if (Object.keys(queryParams).length > 0) {  // If query parameters are present, construct a dynamic query
          const conn = await pool.getConnection();
          const keys = Object.keys(queryParams);
          const values = Object.values(queryParams);

          const query = `SELECT * FROM ActivityTypes WHERE ${keys.map(key => `${key} = ?`).join(' AND ')}`;
          const rows = await conn.query(query, values);

          conn.release();

          if (rows.length > 0) {
              res.json(rows);
          } else {
              res.status(404).json({ error: 'No matching activity types found' });
          }
      } else {
          res.status(400).json({ error: 'Invalid request. Provide query parameters.' });
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {  // Add 1 activity type
    const {
        activityName,
        short_discription,
        discription,
        IMG_path,
        startTime,
        EndTime,
        maxPersons
    } = req.body;

    if (!activityName || maxPersons === undefined) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    try {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO ActivityTypes (activityName, short_discription, discription, IMG_path, startTime, EndTime, maxPersons) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [activityName,
            short_discription,
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
        short_discription,
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

router.patch('/:id', async (req, res) => {  // Update 1
  const activityTypeId = req.params.id;

  const {  // Extract fields from the request body that can be updated
    activityName,
    short_discription,
    discription,
    IMG_path,
    startTime,
    EndTime,
    maxPersons
  } = req.body;

  if (!activityName && !short_discription && !discription && !IMG_path && !startTime && !EndTime && maxPersons === undefined) {  // Extract fields from the request body that can be updated
    return res.status(400).json({
      error: 'At least one field is required for updating'
    });
  }

  try {
    const conn = await pool.getConnection();

    const updateFields = [];  // Build the SQL UPDATE query based on the provided fields
    const updateValues = [];

    if (activityName) {
      updateFields.push('activityName = ?');
      updateValues.push(activityName);
    }
    if (short_discription) {
      updateFields.push('short_discription = ?');
      updateValues.push(short_discription);
    }
    if (discription) {
      updateFields.push('discription = ?');
      updateValues.push(discription);
    }
    if (IMG_path) {
      updateFields.push('IMG_path = ?');
      updateValues.push(IMG_path);
    }
    if (startTime) {
      updateFields.push('startTime = ?');
      updateValues.push(startTime);
    }
    if (EndTime) {
      updateFields.push('EndTime = ?');
      updateValues.push(EndTime);
    }
    if (maxPersons) {
      updateFields.push('maxPersons = ?');
      updateValues.push(maxPersons);
    }

    const updateQuery = `UPDATE ActivityTypes SET ${updateFields.join(', ')} WHERE id = ?`;

    const result = await conn.query(
      updateQuery,
      [...updateValues, activityTypeId]
    );

    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Activity type not found'
      });
    }

    res.json({
      message: 'Activity type updated successfully'
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

router.delete('/:id', async (req, res) => {  // Delete 1
  const activityTypeId = req.params.id;

  try {
    const conn = await pool.getConnection();

    const result = await conn.query(
      'DELETE FROM ActivityTypes WHERE id = ?', [activityTypeId]
    );

    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Activity type not found'
      });
    }

    res.json({
      message: 'Activity type deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;