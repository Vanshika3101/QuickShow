import { useEffect, useState } from "react";
import axios from "axios";

function AddMovie({fetchMovies, editMovie, setEditMovie }){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [posterUrl, setPosterUrl] = useState("");

    useEffect(()=> {
        if(editMovie){
            setTitle(editMovie.title);
            setDescription(editMovie.description);
            setPosterUrl(editMovie.posterUrl);
        }
    }, [editMovie]);

    const addMovie = () => {
        if(editMovie){
            //update 
            axios.put(`http://quickshow-backend-pd1e.onrender.com/api/movies/update/${editMovie._id}`, {
                title,
                description,
                posterUrl
            })
            .then(() => {
                console.log("Movie Updated 🎬")
                setEditMovie(null);
                fetchMovies();

                setTitle("");
                setDescription("");
                setPosterUrl("");
            })
        }else{
        axios.post("http://quickshow-backend-pd1e.onrender.com/api/movies/add", {
            title,
            description,
            posterUrl
        })
        .then(res => {
            console.log("Movie Added 🎬", res.data);
            fetchMovies();

            setTitle("");
            setDescription("");
            setPosterUrl("");
        })
        .catch(err => {
            console.log("Add Movie Error ❌", err);
        });
    }
};

    return (
        <div>
            <h2>{editMovie ? "Edit Movie ✏️" : "Add Movie ➕"}</h2>

            <input
            type="text" 
            placeholder="Movie Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />

            <br /><br />

            <input type="text"
            placeholder="Movie Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />

            <br /><br />

            <input
            type="text"
            placeholder="Poster URL"
            value={posterUrl}
            onChange={(e) => setPosterUrl(e.target.value)}
            />

             <br /><br />

            <button onClick={addMovie}>
                 {editMovie ? "Update Movie ✏️" : "Add Movie 🎬"}
            </button>

            {editMovie && (
                <button onClick={()=> {
                    setEditMovie(null);
                    setTitle("");
                    setDescription("");
                    setPosterUrl("");
                }}>
                    Cancel ❌
                </button>
            )}
        </div>
    );
}

export default AddMovie;