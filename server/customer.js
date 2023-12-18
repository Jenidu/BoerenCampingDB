const mariaDB = require('mariadb')

// ORM

const customerSchema = new mariaDB.Schema({
    firstName: {
        type: String,
        required: true
    },
    surName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    homeAddress: {
        type: String,
        required: true
    },
    homeCountry: {
        type: String,
        required: true
    },
    latestBookingDate: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mariaDB.model('customers', customerSchema)