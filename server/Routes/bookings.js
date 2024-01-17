const express = require('express');
const router = express.Router();
const pool = require('../pool');

router.get('/', async (req, res) => {  // Get all bookings
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM Bookings');
      conn.release();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

router.get('/search', async (req, res)  => {  // Search bookings
  try {
      const queryParams = req.query;

      if (Object.keys(queryParams).length > 0) {  // If query parameters are present, construct a dynamic query
          const conn = await pool.getConnection();
          const keys = Object.keys(queryParams);
          const values = Object.values(queryParams);

          const query = `SELECT * FROM Bookings WHERE ${keys.map(key => `${key} = ?`).join(' AND ')}`;
          const rows = await conn.query(query, values);

          conn.release();

          if (rows.length > 0) {
              res.json(rows);
          } else {
              res.status(404).json({ error: 'No matching bookings found' });
          }
      } else {
          res.status(400).json({ error: 'Invalid request. Provide query parameters.' });
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {  // Add 1 booking
    const {
      customerID,
      spotID,
      startDate,
      endDate,
      adults,
      children,
      babies,
      pets,
      transactionPrice,
      numberplate,
      electricCar,
      notes
    } = req.body;
  
    if (!customerID || !spotID || !startDate || !endDate ||
      adults === undefined || children === undefined || babies === undefined || pets === undefined || transactionPrice === undefined) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO Bookings (customerID, spotID, startDate, endDate, adults, children, babies, pets, transactionPrice, numberplate, electricCar, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [customerID,
          spotID,
          startDate,
          endDate,
          adults,
          children,
          babies,
          pets,
          transactionPrice,
          numberplate,
          electricCar,
          notes]
      );
      conn.release();
  
      const insertId = Number(result.insertId);
  
      res.json({
        id: insertId,
        customerID,
        spotID,
        startDate,
        endDate,
        adults,
        children,
        babies,
        pets,
        transactionPrice,
        numberplate,
        electricCar,
        notes
      });
    } catch (err) {
      res.status(500).json({
        error: err.message
      });
    }
});

router.patch('/:id', async (req, res) => {  // Update 1
  const bookingId = req.params.id;

  const {  // Extract fields from the request body that can be updated
    customerID,
    spotID,
    startDate,
    endDate,
    adults,
    children,
    babies,
    pets,
    transactionPrice,
    numberplate,
    electricCar,
    notes
  } = req.body;

  if (!customerID && !spotID && !startDate && !endDate && adults === undefined && children === undefined && babies === undefined && pets === undefined &&
    transactionPrice === undefined && !numberplate && electricCar === undefined && !notes) {
    return res.status(400).json({
      error: 'At least one field is required for updating'
    });
  }

  try {
    const conn = await pool.getConnection();

    const updateFields = [];  // Build the SQL UPDATE query based on the provided fields
    const updateValues = [];

    if (customerID) {
      updateFields.push('customerID = ?');
      updateValues.push(customerID);
    }
    if (spotID) {
      updateFields.push('spotID = ?');
      updateValues.push(spotID);
    }
    if (startDate) {
      updateFields.push('startDate = ?');
      updateValues.push(startDate);
    }
    if (endDate) {
      updateFields.push('endDate = ?');
      updateValues.push(endDate);
    }
    if (adults) {
      updateFields.push('adults = ?');
      updateValues.push(adults);
    }
    if (children) {
      updateFields.push('children = ?');
      updateValues.push(children);
    }
    if (babies) {
      updateFields.push('babies = ?');
      updateValues.push(babies);
    }
    if (pets) {
      updateFields.push('pets = ?');
      updateValues.push(pets);
    }
    if (transactionPrice) {
      updateFields.push('transactionPrice = ?');
      updateValues.push(transactionPrice);
    }
    if (numberplate) {
      updateFields.push('numberplate = ?');
      updateValues.push(numberplate);
    }
    if (electricCar) {
      updateFields.push('electricCar = ?');
      updateValues.push(electricCar);
    }
    if (notes) {
      updateFields.push('notes = ?');
      updateValues.push(notes);
    }

    const updateQuery = `UPDATE Bookings SET ${updateFields.join(', ')} WHERE id = ?`;

    const result = await conn.query(
      updateQuery,
      [...updateValues, bookingId]
    );

    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Booking not found'
      });
    }

    res.json({
      message: 'Booking updated successfully'
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

router.delete('/:id', async (req, res) => {  // Delete 1
  const bookingId = req.params.id;

  try {
    const conn = await pool.getConnection();

    const result = await conn.query(
      'DELETE FROM Bookings WHERE id = ?', [bookingId]
    );

    conn.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Booking not found'
      });
    }

    res.json({
      message: 'Booking deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;