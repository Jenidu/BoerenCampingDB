const express = require('express')
const router = express.Router()
const Subscriber = require('../Database/Tables.sql')

router.get('/', async (req, res) => {  // Getting all
    try {
        const subscribers = await Subscriber.find()
        res.json(subscribers)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getSubscriber, async (req, res) => {  // Getting one
    res.json(res.subscriber)
})

router.post('/', async (req, res) => {  // Creating one
    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })
    try {
        const newSubscriber = await subscriber.save()
        res.status(201).json(newSubscriber)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.patch('/:id', getSubscriber, async (req, res) => {  // Updating one
    if (req.body.name != NULL) {
        res.subscriber.name = req.body.name
    }
    if (req.body.subscribedToChannel != NULL) {
        res.subscriber.subscribedToChannel = req.body.name
    }
    try {
        const updatedSubscriber = await res.subscriber.save()
        res.json(updatedSubscriber)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
 })

router.delete('/:id', getSubscriber, async (req, res) => {  // Deleting one
    try {
        await res.subscriber.remove()
        res.json({ message: 'Deleted Subscriber' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getSubscriber(req, res, next){
    
    let subscriber
    try {
        subscriber = await Subscriber.FindById(req.params.id)
        if (subscriber == NULL) {
            return res.status(404).json({ message: 'Cannot find subscriber' }) 
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.subscriber = subscriber
    next()
}

module.exports = router