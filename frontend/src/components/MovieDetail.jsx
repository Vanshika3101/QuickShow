import { useNavigate, useParams } from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

function MovieDetail(){
    const {id} = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        setLoading(true);
        axios.get(`https://quickshow-jn4r.onrender.com/api/movies`)
          .then(res => {
              const found = res.data.find(m=> m._id === id);
              setMovie(found || null);
          })
          .finally(() => setLoading(false));
    },[id]);

    if(loading) return <p>⏳ Loading...</p>;
    if(!movie) return <p>Movie not found</p>;

    return(
    <div style={{ padding: "20px" }}>
      <h1>🎬 {movie.title}</h1>

      <img 
        src={movie.posterUrl}
        alt={movie.title}
        style={{ width: "300px", borderRadius: "10px" }}
      />

      <p style={{ marginTop: "20px" }}>
        {movie.description}
      </p>

      <button onClick={() => navigate(`/movies/${id}/shows`)}>
        Select Showtime
      </button>
    </div>
    );
}

export default MovieDetail;