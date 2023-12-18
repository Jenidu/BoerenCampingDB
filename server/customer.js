// const mariaDB = require('mariadb')
// const Schema = mariaDB.Schema;

// // ORM?

// const customerSchema = new Schema({
//     firstName: {
//         type: String,
//         required: true
//     },
//     surName: {
//         type: String,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     phoneNumber: {
//         type: String,
//         required: true
//     },
//     homeAddress: {
//         type: String,
//         required: true
//     },
//     homeCountry: {
//         type: String,
//         required: true
//     },
//     latestBookingDate: {
//         type: Date,
//         required: true,
//         default: Date.now
//     }
// })
// module.exports = mariaDB.model('customers', customerSchema)

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mariadb',
  host: 'localhost',
  username: 'root',
  database: 'BookingSystem',
});

const Customer = sequelize.define('Customer', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  homeAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  homeCountry: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latestBookingDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database and table synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  } finally {
    await sequelize.close();
  }
})();
