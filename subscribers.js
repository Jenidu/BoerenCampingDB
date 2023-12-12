const mariaDB = require('mariadb')

const subscriberSchema = new mariaDB.Schema({
    name: {
        type: String,
        required: true
    },
    subscribedToChannel: {
        type: String,
        required: true
    },
    subscriberDate: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mariaDB.model('Subscriber',subscriberSchema)