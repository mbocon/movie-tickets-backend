const express = require('express');
const moviesRouter = express.Router();
const Movie = require('../models/movie');

const admin = require('firebase-admin');
const serviceAccount = require('../service-account-credentials.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

async function isAuthenticated(req, res, next) {
    try {
        const token = req.get('Authorization');
        if (!token) throw new Error('No token found, please login');
        const user = await admin.auth().verifyIdToken(token.replace('Bearer ', ''));
        if (!user) throw new Error('Something went wrong, invalid token');
        req.user = user;
        next();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

function index(req,res){
    Movie.find({uId: req.user.uid }, (err, movie) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(movie);
        }
    })
}

// Index Route - Get all movie from the database 
moviesRouter.get('/', isAuthenticated, (req, res) => {
   index(req,res)
});

// Create Route - Add a new movie to the database
moviesRouter.post('/', isAuthenticated, (req, res) => {
    req.body.uId = req.user.uid;
    Movie.create(req.body, (err, movie) => {
        if (err) {
            res.status(400).json(err);
        } else {
            index(req,res)
        }
    })
});

// Read/Show Route - Get a single movie from the database
moviesRouter.get('/:id', (req, res) => {
    Movie.findById(req.params.id, (err, movie) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(movie);
        }
    })
});

// Update Route - Update a single movie in the database
moviesRouter.put('/:id', isAuthenticated, (req, res) => {
    Movie.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, movie) => {
        if (err) {
            res.status(400).json(err);
        } else {
            index(req,res)
        }
    })
});

// Delete Route - Delete a single movie from the database
moviesRouter.delete('/:id', isAuthenticated, (req, res) => {
    Movie.findByIdAndDelete(req.params.id, (err, movie) => {
        if (err) {
            res.status(400).json(err);
        } else {
            index(req,res)
        }
    })
});

module.exports = moviesRouter;