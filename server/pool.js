const mariaDB = require('mariadb');
require('dotenv').config();

let pool

try {
    pool = mariaDB.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT)});
  }
  catch (err) {
    console.error("Error creating mariaDB pool:", err)
}

module.exports = pool;