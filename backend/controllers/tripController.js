const Trip = require('../models/Trip');
const User = require('../models/User');
const Post = require('../models/Post');
const axios = require('axios');

const createTrip = async (req, res, next) => {
    try {
        const getCoverFromPexels = await axios.get(`https://api.pexels.com/v1/search?query=${req.body.destination.destination_city || req.body.destination.destination_name} random skyline`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.PEXELS_API_KEY,
            }
        })
        const data = await getCoverFromPexels.data.photos[0].src.landscape;
        const trip = new Trip({
            ...req.body,
            cover: data || 'http://placehold.it/600x400/',
            userId: req.user.userId,
        });
        const relUser = await User.findById(req.user.userId)
        await trip.save()
        relUser.trips.push(trip._id)
        await relUser.save()
        if (req.body.public === true) {
            const post = new Post({
                userId: req.user.userId,
                content: 'I\'ve recently added a new trip in my profile, check it out',
                public: true
            })
            await post.save()
        }
        req.body = {
            ...req.body,
            tripId: trip._id,
        }
        next()
    } catch (e) {
        console.log(e)
        next({statusCode: 500, message: e.message});
    }
}

const editTrip = async (req, res, next) => {
    const {id} = req.params

    try {
        if (!id) return res.status(400).send({message: "No id found"})

        const trip = await Trip.findById(id)

        if (String(trip.userId) !== req.user.userId) return res.status(401).json({message: "Unauthorized to edit"})

        const editedTrip = await Trip.findByIdAndUpdate(id, req.body, {new: true})

        res.status(200).json({message: "Successfully edited trip", editedTrip})

    } catch (e) {
        console.error(e)
        next({statusCode: 400, message: e.message});
    }
}

const deleteTrip = async (req, res, next) => {
    const {id} = req.params

    try {
        if (!id) return res.status(400).send({message: "No id found"})

        const trip = await Trip.findById(id)

        if (String(trip.userId) !== req.user.userId) return res.status(401).json({message: "Unauthorized to delete"})

        const relUser = await User.findById(req.user.userId)
        relUser.trips.pull(trip._id)
        await relUser.save()

        const deletedTrip = await Trip.findByIdAndDelete(id)

        res.status(200).json({message: "Successfully deleted trip", deletedTrip})
    } catch (e) {
        console.error(e)
        next({statusCode: 400, message: e.message});
    }
}

const getTripById = async (req, res, next) => {
    const {id} = req.params

    try {
        if (!id) return res.status(400).send({message: "No id found"})

        const trip = await Trip.findById(id).populate('milestones userId')

        if(!trip) return res.status(400).send({message: "No trip found"})

        res.status(200).json(trip)

    } catch (e) {
        console.error(e)
        next({statusCode: 500, message: e.message});
    }
}

const likeTrip = async (req, res, next) => {
    const {id} = req.params

    try {
        if (!id) return res.status(400).send({message: "No id found"})

        const trip = await Trip.findById(id)

        if (trip.likes.includes(req.user.userId)) {
            return res.status(401).send({message: "You already liked this trip"})
        }

        if(!trip) return res.status(400).send({message: "No trip found"})

        const user = await User.findById(req.user.userId)
        user.liked_trips.push(trip._id)
        user.save()

        trip.likes.push(user._id)
        trip.save()

        res.status(200).json({message: "Trip successfully liked", trip})

    } catch (e) {
        console.error(e)
        next({statusCode: 500, message: e.message});
    }

}


const unlikeTrip = async (req, res, next) => {
    const {id} = req.params

    try {
        if (!id) return res.status(400).send({message: "No id found"})

        const trip = await Trip.findById(id)

        if(!trip) return res.status(400).send({message: "No trip found"})

        const user = await User.findById(req.user.userId)

        user.liked_trips.pull(trip._id)
        user.save()

        trip.likes.pull(user._id)
        trip.save()

        res.status(200).json({message: "Trip successfully unliked", trip})

    } catch (e) {
        console.error(e)
        next({statusCode: 500, message: e.message});
    }

}

const changeCover = async (req, res, next) => {
    const {id} = req.params

    if (!req.file) return res.status(400).json({message: 'No file uploaded'});

    try {
        if (!id) return res.status(400).send({message: "No id found"})

        const trip = await Trip.findById(id)

        if (!trip) return res.status(400).send({message: "No trip found"})

        const editedTrip = await Trip.findByIdAndUpdate(id, {
            ...req.body,
            cover: req.file.path
        }, {new: true})

        res.status(201).json(editedTrip)
    } catch (e) {
        next({statusCode: 400, message: e.message});
    }
}


module.exports = {
    createTrip,
    editTrip,
    deleteTrip,
    getTripById,
    likeTrip,
    unlikeTrip,
    changeCover
}