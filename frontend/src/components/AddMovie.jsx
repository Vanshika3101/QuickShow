import { useEffect, useState } from "react";
import axios from "axios";
import {toast} from "react-toastify";

function AddMovie({fetchMovies, editMovie, setEditMovie }){
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [posterUrl, setPosterUrl] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error,setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(()=> {
        if(editMovie){
            setTitle(editMovie.title);
            setDescription(editMovie.description);
            setPosterUrl(editMovie.posterUrl);
        }
    }, [editMovie]);

    const uploadImage = async()=>{
        try{
            setUploading(true);
            setError("");

        const formData = new FormData();
        formData.append("image", image);

        const res = await axios.post(
            "https://quickshow-jn4r.onrender.com/api/movies/upload",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return res.data.url;
        }catch(err){
            setError("Image upload failed ❌");
            return null;
        }finally{
            setUploading(false);
        }
    };

    const addMovie = async () => {
        let imageUrl = posterUrl;
        if(image){
            imageUrl = await uploadImage();
            if(!imageUrl) return;
        }

        if(editMovie){
            await axios.put(`https://quickshow-jn4r.onrender.com/api/movies/update/${editMovie._id}`, {
                title,
                description,
                posterUrl:imageUrl,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
            .then(() => {
                console.log("Movie Updated 🎬")
                setEditMovie(null);
                fetchMovies();

                setTitle("");
                setDescription("");
                setImage(null);
                setPreview("");
                setPosterUrl("");
            });
        }else{
        await axios.post("https://quickshow-jn4r.onrender.com/api/movies/add", {
            title,
            description,
            posterUrl:imageUrl
        },{
            headers:{
            Authorization:`Bearer ${token}`,
            },
        })
        .then(res => {
            console.log("Movie Added 🎬", res.data);
            toast.success("Movie Added 🎬")
            fetchMovies();

            setTitle("");
            setDescription("");
            setPosterUrl("");
        })
        .catch(err => {
            console.log("Add Movie Error ❌", err);
            toast.error("Failed to add movie ❌");
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

            <input 
            type="file"
            accept="image/*"
            onChange={(e) => {
                const file = e.target.files[0];
                setImage(file);

                if(file){
                    const url = URL.createObjectURL(file);
                    setPreview(url);
                }
            }
        }
     />

            <br /><br />

            {preview && (
                <img
                src={preview}
                alt="preview"
                style={{
                    width: "150px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginTop: "10px" 
                }}
                />
            )}

            {uploading && <p>⏳ Uploading image...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
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