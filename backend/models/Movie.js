const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: String,
    description: String,
    posterUrl: String,
    userId:String,
    isFavorite:{
        type:Boolean,
        default:false
    }
});

module.exports = mongoose.model("Movie", movieSchema);