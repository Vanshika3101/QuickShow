const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
router.get("/", async(req,res)=>{
    const movies = await Movie.find();
    res.json(movies);
})

router.post("/add",async(req,res)=>{
    const movie = new Movie(req.body);
    await movie.save();
    res.json(movie);
});

router.put("/update/:id", async(req,res) => {
    try{
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

router.delete("/delete/:id", async(req,res) => {
    try{
        await Movie.findByIdAndDelete(req.params.id);
        res.json({message: "Movie Deletedddd ❌"});
    }catch(err){
        res.status(500).json({error:err});
    }
});

module.exports = router;

