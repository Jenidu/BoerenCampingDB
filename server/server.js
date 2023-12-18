require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const mariaDB = require('mariadb')

app.use(cors())

try {
  const pool = mariaDB.createPool({host: process.env.DB_HOST, user: process.env.DB_USER, connectionLimit: 5});
}
catch (err) {
  console.error("Error creating mariaDB pool:", err)
}


async function asyncFunction() {
  let conn
  try {

	conn = await pool.getConnection()
	const rows = await conn.query("SELECT 1 as val")
	// rows: [ {val: 1}, meta: ... ]

  } finally {
	if (conn) conn.release() //release to pool
  }
}

app.use(express.json())

const customerRouter = require('./Routes/customers.js')
app.use('/customers', customerRouter)

app.listen(3000, () => console.log('Server started'))
