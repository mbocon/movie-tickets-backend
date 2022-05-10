const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: String,
    releaseDate: Date,
    rating: Number,
    genre: String,
    trailer: String,
    cast: { type: Array, default: [] },
    description: String,
    runtime:  Number,
    showtimes: { type: Array, default: [] },
    img: String,
    uId: String,
    theaters: { type: Array, default: [], ref: 'Theater' },
});

module.exports = mongoose.model('Movie', movieSchema);