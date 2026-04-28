const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
    {
        movieId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
            required: true,
        },
        theater: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 200,
        },
        totalSeats: {
            type: Number,
            required: true,
            default: 20,
        },
        bookedSeats: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Show", showSchema);
