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

//get single movie
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

        //toggle
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
        const result = await cloudinary.uploader.upload_stream(
            {folder:"movies"},
        (error,result) => {
            if(error) return res.status(500).json(error);
            res.json({url: result.secure_url});
        });
        result.end(req.file.buffer);
    } catch(err){
        res.status(500).json(err);
    }
});
module.exports = router;

