const express = require('express');
const router = express.Router();
const pool = require('../pool');
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {  // Check if password is right
	const [userName, userPassword] = req.body;
	if (!userName || !userPassword) {
		return res.status(400).json({
			error: 'All fields are required'
		});
	}

	try {
		
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.post('/', async (req, res) => {  // Add 1 user
	const {
		userName,
		userPassword,
		userEmail
	} = req.body;

	if (!userName || !userPassword || !userEmail) {
		return res.status(400).json({
			error: 'All fields are required'
		});
	}

	try {
		const conn = await pool.getConnection();
		const results = await conn.query('SELECT (userName, userEmail) FROM AdminUsers');
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

	bcrypt
		.genSalt(saltRounds)
		.then(userSalt => {
			return bcrypt.hash(userPassword, userSalt)
		})
		.then(async hash => {
			// split the hash into the salt and the hash parts
			const userSalt = hash.slice(7, 29);
			const userHashedPassword = hash.slice(29);

			try {
				const conn = await pool.getConnection();
				const result = await conn.query(
					'INSERT INTO AdminUsers (userName, userHashedPassword, userEmail, userType, userSalt) VALUES (?, ?, ?, ?, ?)',
					[userName, userHashedPassword, userEmail, userType, userSalt]
				);
				conn.release();
			} catch (err) {
				res.status(500).json({
					error: err.message
				});
			}
		})
		.then(result=>{
			res.status(200).json({
				message: 'User added successfully'
			});
		})
		.catch(err => {
			console.error(err.message)
			res.status(500).json({
				error: err.message
			});	
		});
});

module.exports = router;