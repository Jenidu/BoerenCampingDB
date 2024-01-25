const express = require('express');
const router = express.Router();
const pool = require('../pool');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {  // Check if password is right
	const { userName,
		userPassword
	} = req.body;

	if (!userName || !userPassword) {
		return res.status(400).json({
			error: 'All fields are required'
		});
	}

	try {
		const conn = await pool.getConnection();
		const result = await conn.query('SELECT * FROM AdminUsers WHERE userName = ?', [userName]);
		conn.release();

		if (result.length === 0) {
			return res.status(404).json({
				error: 'Username does not exist'
			});
		}
		const userHashedPassword = result[0].userHashedPassword;
		const userType = result[0].userType;


		if (userPassword === userHashedPassword) {
			res.status(200).json({
				message: 'Password is correct',
				userType: userType
			});
		} else {
			res.status(401).json({
				error: 'Password is incorrect'
			});
		}


		// bcrypt 
		// 	.compare(userPassword, userHashedPassword)
		// 	.then(result => {
		// 		if (result) {
		// 			res.status(200).json({
		// 				message: 'Password is correct',
		// 				userType: userType
		// 			});
		// 		} else {
		// 			res.status(401).json({
		// 				error: 'Password is incorrect'
		// 			});
		// 		}
		// 	})
		// 	.catch(err => {console.log(err)});

	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

router.post('/signup', async (req, res) => {  // Add 1 user
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

	const userType = 'notDefined';

	try {
		const conn = await pool.getConnection();
		const found_user = await conn.query(`SELECT * FROM AdminUsers WHERE userName = ?`, [userName]);
		const found_email = await conn.query(`SELECT * FROM AdminUsers WHERE userEmail = ?`, [userEmail]);
		conn.release();

		if (found_user.length > 0) {
			return res.status(400).json({
				error: 'Username already exists'
			});
		}
		if (found_email.length > 0) {
			return res.status(400).json({
				error: 'Email already exists'
			});
		}
	} catch (err) {
		return res.status(500).json({
			error: err.message
		});
	}
	const saltRounds = 10;

	bcrypt
		.hash(userPassword, saltRounds)
		.then(async hash => {
			const userHashedPassword = hash
			try {
				const conn = await pool.getConnection();
				const result = await conn.query(
					'INSERT INTO AdminUsers (userName, userHashedPassword, userEmail, userType) VALUES (?, ?, ?, ?)',
					[userName, userHashedPassword, userEmail, userType]
				);
				conn.release();
			} catch (err) {
				res.status(500).json({
					error: err.message
				});
			}
		})
		.then(result => {
			res.status(200).json({
				message: 'User added successfully',
				userType: userType
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err.message
			});
		});
});

module.exports = router;