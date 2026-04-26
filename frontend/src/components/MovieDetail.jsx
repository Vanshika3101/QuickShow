import { useParams } from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

function MovieDetail(){
    const {id} = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(()=>{
        const token = localStorage.getItem("token");

        axios.get(`https://quickshow-jn4r.onrender.com/api/movies`,{
            headers:{
                Authorization : `Bearer ${token}`
            }
        })
        .then(res => {
            const found = res.data.find(m=> m._id === id);
            setMovie(found);
        })
    },[id]);

    if(!movie) return <p>⏳ Loading...</p>;

    return(
    <div style={{ padding: "20px" }}>
      <h1>🎬 {movie.title}</h1>

      <img 
        src={movie.posterUrl}
        style={{ width: "300px", borderRadius: "10px" }}
      />

      <p style={{ marginTop: "20px" }}>
        {movie.description}
      </p>
    </div>
    );
}

export default MovieDetail;