const express = require('express');
const router = express.Router();
const pool = require('../pool');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {  // Get all users
	try {
		const conn = await pool.getConnection();
		const rows = await conn.query('SELECT * FROM AdminUsers');
		conn.release();
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.get('/:id', async (req, res) => {  // Check if password is right
	try {

	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.post('/', async (req, res) => {  // Add 1 user
	const {
		username,
		password,
		email
	} = req.body;

	if (!username || !password || !email) {
		return res.status(400).json({
			error: 'All fields are required'
		});
	}

	try {
		const conn = await pool.getConnection();
		const results = await conn.query('SELECT (username, userEmail) FROM AdminUsers');
		conn.release();

		for (let result of results) {
			if (result.username === username || result.userEmail === email) {
				return res.status(400).json({
					error: 'Username or email already exists'
				});
			}

		}
	} catch (err) {
		return res.status(500).json({
			error: err.message
		});
	}
	const saltRounds = 10;

	bcrypt.genSalt(saltRounds, function (err, salt) {
		bcrypt.hash(password, salt, async function (err, hash) {
			if (err) {
				return res.status(500).json({
					error: err.message
				});
			}

			const userType = 'nothing'

			try {
				const conn = await pool.getConnection();
				const result = await conn.query(
					'INSERT INTO AdminUsers (userName, UserHash, userEmail, userType) VALUES (?, ?, ?)',
					[username, hash, email, userType]
				);
				conn.release();

				res.json({
					success: true,
					message: 'User added successfully'
				});
			} catch (err) {
				res.status(500).json({
					error: err.message
				});
			}
		});		
	});
});

module.exports = router;