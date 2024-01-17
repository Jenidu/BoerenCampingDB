const express = require('express');
const router = express.Router();
const pool = require('../pool');

router.get('/', async (req, res) => {  // Get all activities
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM Activities');
      conn.release();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.get('/search', async (req, res)  => {  // Search activities
  try {
      const queryParams = req.query;

      if (Object.keys(queryParams).length > 0) {  // If query parameters are present, construct a dynamic query
          const conn = await pool.getConnection();
          const keys = Object.keys(queryParams);
          const values = Object.values(queryParams);

          const query = `SELECT * FROM Activities WHERE ${keys.map(key => `${key} = ?`).join(' AND ')}`;
          const rows = await conn.query(query, values);

          conn.release();

          if (rows.length > 0) {
              res.json(rows);
          } else {
              res.status(404).json({ error: 'No matching activities found' });
          }
      } else {
          res.status(400).json({ error: 'Invalid request. Provide query parameters.' });
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {  // Add 1 activity
    const {
      activityTypeID,
      startDate,
      endDate
    } = req.body;
    const totalAduls = 0  // When activity is first created there are no participants
    const totalChildren = 0

    if (!activityTypeID || !startDate || !endDate) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO Activities (activityTypeID, totalAduls, totalChildren, startDate, endDate) VALUES (?, ?, ?, ?, ?)',
        [activityTypeID,
            totalAduls,
            totalChildren,
            startDate,
            endDate]
      );
      conn.release();
      
      const insertId = Number(result.insertId);

      res.json({
        id: insertId,
        activityTypeID,
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

router.patch('/:id', async (req, res) => {  // Update 1
  const activityId = req.params.id;

  const {  // Extract fields from the request body that can be updated
    activityTypeID,
    totalAduls,
    totalChildren,
    startDate,
    endDate
  } = req.body;

  if (!activityTypeID && !totalAduls && !totalChildren && !startDate && !endDate) {  // Extract fields from the request body that can be updated
    return res.status(400).json({
      error: 'At least one field is required for updating'
    });
  }

  try {
    const conn = await pool.getConnection();

    const updateFields = [];  // Build the SQL UPDATE query based on the provided fields
    const updateValues = [];

    if (activityTypeID) {
      updateFields.push('activityTypeID = ?');
      updateValues.push(activityTypeID);
    }
    if (totalAduls) {
      updateFields.push('totalAduls = ?');
      updateValues.push(totalAduls);
    }
    if (totalChildren) {
      updateFields.push('totalChildren = ?');
      updateValues.push(totalChildren);
    }
    if (startDate) {
      updateFields.push('startDate = ?');
      updateValues.push(startDate);
    }
    if (endDate) {
      updateFields.push('endDate = ?');
      updateValues.push(endDate);
    }

    const updateQuery = `UPDATE Activities SET ${updateFields.join(', ')} WHERE id = ?`;

    const result = await conn.query(
      updateQuery,
      [...updateValues, activityId]
    );

    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Activity not found'
      });
    }

    res.json({
      message: 'Activity updated successfully'
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

router.delete('/:id', async (req, res) => {  // Delete 1
  const activityId = req.params.id;

  try {
    const conn = await pool.getConnection();

    const result = await conn.query(
      'DELETE FROM Activities WHERE id = ?', [activityId]
    );

    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Activity not found'
      });
    }

    res.json({
      message: 'Activity deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;