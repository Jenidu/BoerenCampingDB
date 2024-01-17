const express = require('express');
const router = express.Router();
const pool = require('../pool');

router.get('/', async (req, res) => {  // Get all activity signups
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM ActivitySignups');
      conn.release();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.get('/search', async (req, res)  => {  // Search activity singups
  try {
      const queryParams = req.query;

      if (Object.keys(queryParams).length > 0) {  // If query parameters are present, construct a dynamic query
          const conn = await pool.getConnection();
          const keys = Object.keys(queryParams);
          const values = Object.values(queryParams);

          const query = `SELECT * FROM ActivitySignups WHERE ${keys.map(key => `${key} = ?`).join(' AND ')}`;
          const rows = await conn.query(query, values);

          conn.release();

          if (rows.length > 0) {
              res.json(rows);
          } else {
              res.status(404).json({ error: 'No matching activity signups found' });
          }
      } else {
          res.status(400).json({ error: 'Invalid request. Provide query parameters.' });
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {  // Add 1 activity signup
    const {
      activityID,
      customerID,
      adults,
      children
    } = req.body;

    if (!activityID || !customerID || adults === undefined || children === undefined) {
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

      const insertId = Number(result.insertId);

      res.json({
        id: insertId,
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

router.patch('/:id', async (req, res) => {  // Update 1
  const Id = req.params.id;

  const {  // Extract fields from the request body that can be updated
    activityID,
    customerID,
    adults,
    children
  } = req.body;

  if (!activityID && !customerID && adults === undefined && children === undefined) {  // Extract fields from the request body that can be updated
    return res.status(400).json({
      error: 'At least one field is required for updating'
    });
  }

  try {
    const conn = await pool.getConnection();

    const updateFields = [];  // Build the SQL UPDATE query based on the provided fields
    const updateValues = [];

    if (activityID) {
      updateFields.push('activityID = ?');
      updateValues.push(activityID);
    }
    if (customerID) {
      updateFields.push('customerID = ?');
      updateValues.push(customerID);
    }
    if (adults) {
      updateFields.push('adults = ?');
      updateValues.push(adults);
    }
    if (children) {
      updateFields.push('children = ?');
      updateValues.push(children);
    }

    const updateQuery = `UPDATE ActivitySignups SET ${updateFields.join(', ')} WHERE id = ?`;

    const result = await conn.query(
      updateQuery,
      [...updateValues, Id]
    );

    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Activity singup not found'
      });
    }

    res.json({
      message: 'Activity singup updated successfully'
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

router.delete('/:id', async (req, res) => {  // Delete 1
  const Id = req.params.id;

  try {
    const conn = await pool.getConnection();

    const result = await conn.query(
      'DELETE FROM ActivitySignups WHERE id = ?', [Id]
    );

    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Activity singup not found'
      });
    }

    res.json({
      message: 'Activity singup deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;