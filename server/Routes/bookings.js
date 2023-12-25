const express = require('express');
const router = express.Router();
const pool = require('../pool');

router.get('/', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM Bookings');
      conn.release();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});
  
router.post('/', async (req, res) => {
    const {
      customerID,
      spotID,
      startDate,
      endDate,
      adults,
      children,
      transactionPrice,
      numberplate,
      electricCar,
      notes
    } = req.body;
  
    if (!customerID || !spotID || !startDate || !endDate || !adults || !children || !transactionPrice) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO Bookings (customerID, spotID, startDate, endDate, adults, children, transactionPrice, numberplate, electricCar, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [customerID,
            spotID,
            startDate,
            endDate,
            adults,
            children,
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

module.exports = router;