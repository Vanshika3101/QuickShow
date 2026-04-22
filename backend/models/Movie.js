const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: String,
    description: String,
    posterUrl: String,
    duration: Number,
    language: String
});

module.exports = mongoose.model("Movie", movieSchema);