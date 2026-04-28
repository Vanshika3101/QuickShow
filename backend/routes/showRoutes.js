const express = require("express");
const router = express.Router();
const Show = require("../models/Show");
const Movie = require("../models/Movie");

router.get("/movie/:movieId", async (req, res) => {
    try {
        const shows = await Show.find({ movieId: req.params.movieId }).sort({ date: 1, time: 1 });
        res.json(shows);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch shows", error: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const show = await Show.findById(req.params.id);
        if (!show) {
            return res.status(404).json({ message: "Show not found" });
        }

        res.json(show);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch show", error: err.message });
    }
});

router.post("/seed/:movieId", async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        const existingShows = await Show.find({ movieId: req.params.movieId });
        if (existingShows.length > 0) {
            return res.status(400).json({ message: "Shows already exist for this movie" });
        }

        const seededShows = await Show.insertMany([
            {
                movieId: req.params.movieId,
                theater: "PVR Cinemas",
                date: "2026-05-01",
                time: "10:00 AM",
                price: 200,
                totalSeats: 20,
            },
            {
                movieId: req.params.movieId,
                theater: "INOX",
                date: "2026-05-01",
                time: "1:30 PM",
                price: 250,
                totalSeats: 20,
            },
            {
                movieId: req.params.movieId,
                theater: "Cinepolis",
                date: "2026-05-01",
                time: "6:00 PM",
                price: 300,
                totalSeats: 20,
            },
        ]);

        res.json({ message: "Shows created successfully", shows: seededShows });
    } catch (err) {
        res.status(500).json({ message: "Failed to seed shows", error: err.message });
    }
});

module.exports = router;
