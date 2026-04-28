const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Show = require("../models/Show");
const Movie = require("../models/Movie");
const auth = require("../middleware/auth");

router.post("/create", auth, async (req, res) => {
    try {
        const { showId, seats } = req.body;

        if (!showId || !Array.isArray(seats) || seats.length === 0) {
            return res.status(400).json({ message: "Show and seats are required" });
        }

        const show = await Show.findById(showId);
        if (!show) {
            return res.status(404).json({ message: "Show not found" });
        }

        const alreadyBooked = seats.filter((seat) => show.bookedSeats.includes(seat));
        if (alreadyBooked.length > 0) {
            return res.status(400).json({
                message: "Some seats are already booked",
                seats: alreadyBooked,
            });
        }

        show.bookedSeats.push(...seats);
        await show.save();

        const booking = new Booking({
            userId: req.user.id,
            movieId: show.movieId,
            showId: show._id,
            seats,
            totalAmount: seats.length * show.price,
        });

        await booking.save();
        res.json({ message: "Booking confirmed", booking });
    } catch (err) {
        res.status(500).json({ message: "Failed to create booking", error: err.message });
    }
});

router.get("/my-bookings", auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });

        const bookingDetails = await Promise.all(
            bookings.map(async (booking) => {
                const movie = await Movie.findById(booking.movieId);
                const show = await Show.findById(booking.showId);

                return {
                    _id: booking._id,
                    seats: booking.seats,
                    totalAmount: booking.totalAmount,
                    status: booking.status,
                    createdAt: booking.createdAt,
                    movieTitle: movie?.title || "Movie",
                    posterUrl: movie?.posterUrl || "",
                    theater: show?.theater || "",
                    date: show?.date || "",
                    time: show?.time || "",
                };
            })
        );

        res.json(bookingDetails);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
    }
});

module.exports = router;
