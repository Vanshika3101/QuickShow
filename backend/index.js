const express = require("express");
const cors = require ("cors");
const mongoose = require ("mongoose")
require("dotenv").config();

const movieRoutes = require("./routes/movieRoutes")
const authRoutes = require("./routes/authRoutes");
const showRoutes = require("./routes/showRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection", reason);
});

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Quick Show is running");
})

app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", bookingRoutes);

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000
})
.then(() => console.log("MongoDB connected ✔"))
.catch(err => console.log("MongoDB ERROR ❌", err.message));

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port : ${PORT}`)
})
