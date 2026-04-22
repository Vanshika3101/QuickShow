const express = require("express");
const cors = require ("cors");
const mongoose = require ("mongoose")
require("dotenv").config();
const movieRoutes = require("./routes/movieRoutes")

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
};
app.use(cors(corsOptions));

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Quick Show is running");
})

app.use("/api/movies",movieRoutes);


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
