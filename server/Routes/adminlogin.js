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
		const conn = await pool.getConnection();
		const result = await conn.query('SELECT (userSalt, userHashedPassword, userType) FROM AdminUsers WHERE userName = ?', [userName]);
		conn.release();

		if (result.length === 0) {
			return res.status(404).json({
				error: 'Username does not exist'
			});
		}
		const userSalt = result[0].userSalt;
		const userHashedPassword = result[0].userHashedPassword;
		const userType = result[0].userType;

		const fullHash = '$2b$10$' + userSalt + userHashedPassword;

		if (bcrypt.compare(userPassword, fullHash)) {
			res.status(200).json({
				message: 'Password is correct',
				userType: userType
			});
		} else {
			res.status(401).json({
				error: 'Password is incorrect'
			});
		}
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
			if (result.userName === userName || result.userEmail === userEmail) {
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