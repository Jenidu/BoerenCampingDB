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

router.get('/:id', async (req, res) => {  // Get 1 activity singup
  try {
      const Id = req.params.id;
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM ActivitySignups WHERE id = ?', [Id]);
      conn.release();

      if (rows.length > 0) {
          res.json(rows[0]);
      } else {
          res.status(404).json({ error: 'Activity singup not found' });
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

  if (!activityID && !customerID && !adults && !children) {  // Extract fields from the request body that can be updated
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