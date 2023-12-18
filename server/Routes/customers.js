const express = require('express')
const router = express.Router()
const Customer = require('../customer')

router.get('/', async (req, res) => {  // Getting all
    try {
        const customers = await Customer.find()
        res.json(customers)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getCustomer, async (req, res) => {  // Getting one
    res.json(res.subscriber)
})

router.post('/', async (req, res) => {  // Creating one
    const customer = new Customer({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })
    try {
        const newCustomer = await customer.save()
        res.status(201).json(newCustomer)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.patch('/:id', getCustomer, async (req, res) => {  // Updating one
    if (req.body.name != NULL) {
        res.subscriber.name = req.body.name
    }
    if (req.body.subscribedToChannel != NULL) {
        res.subscriber.subscribedToChannel = req.body.name
    }
    try {
        const updatedCustomer = await res.subscriber.save()
        res.json(updatedCustomer)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
 })

router.delete('/:id', getCustomer, async (req, res) => {  // Deleting one
    try {
        await res.subscriber.remove()
        res.json({ message: 'Deleted Subscriber' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getCustomer(req, res, next){
    
    let customer
    try {
        customer = await Customer.FindById(req.params.id)
        if (customer == NULL) {
            return res.status(404).json({ message: 'Cannot find subscriber' }) 
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.subscriber = customer
    next()
}

module.exports = router