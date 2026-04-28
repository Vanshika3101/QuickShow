const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const cloudinary = require("../utils/cloudinary");

router.get("/",async(req,res)=>{
    const movies = await Movie.find();
    res.json(movies);
})

router.get("/:id",async(req,res) => {
    try{
        const movie = await Movie.findById(req.params.id);
        if(!movie){
            return res.status(404).json({
                message:"Movie not found"
            });

            if(movie.userId.toString() !== req.user.id){
                return res.status(403).json({
                    message:"Not allowed"
                })
            }

            res.json(movie)
        }
    }catch(err){
        res.status(500).json(err);
    }
});

router.post("/add",auth, async(req,res)=>{
    try{
        const movie = new Movie({
            ...req.body,
            userId: req.user.id
        });
        await movie.save();
        res.json(movie);
    }catch(err){
        res.status(500).json(err);
    }
});

router.put("/update/:id",auth, async(req,res) => {
    try{
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
        }

        if (movie.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not allowed" });
        }

        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        res.json(updatedMovie);
    }catch(err){
        res.status(500).json(err);
    }
});

router.put("/favorite/:id", auth, async(req,res)=>{
    try{
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
        }

        if (movie.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not allowed" });
        }

        movie.isFavorite = !movie.isFavorite;
        await movie.save();
        res.json(movie);

    }catch(err){
        res.status(500).json(err);
    }
});

router.delete("/delete/:id", auth, async(req,res) => {
    try{
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
        }

        if (movie.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not allowed" });
        }

        await Movie.findByIdAndDelete(req.params.id);
        res.json({message: "Movie Deletedddd ❌"});
    }catch(err){
        res.status(500).json({error:err});
    }
});

router.post("/upload", upload.single("image"), async(req,res) => {
    try{
        if(!req.file){
            return res.status(400).json({ message: "Image file is required" });
        }

        const imageUrl = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "movies" },
                (error, result) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(result.secure_url);
                }
            );

            stream.end(req.file.buffer);
        });

        res.json({url: imageUrl});
    } catch(err){
        res.status(500).json({ message: "Image upload failed", error: err.message });
    }
});
module.exports = router;

