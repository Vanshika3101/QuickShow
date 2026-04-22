import { useEffect, useState } from "react";
import axios from "axios"
import AddMovie from "./components/AddMovie";

function App(){
  const [movies, setMovies] = useState([]);
  const [editMovie, setEditMovie] = useState(null);
  
  const fetchMovies = () => {
    axios.get("https://quickshow-backend-pd1e.onrender.com/api/movies")
    .then(res => setMovies(res.data))
    .catch(err => console.log(err));
  }

  const deleteMovie = (id) => {
    axios.delete(`https://quickshow-backend-pd1e.onrender.com/api/movies/delete/${id}`)
    .then(() => {
      fetchMovies(); //refresh list
    })
    .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div >
      <h1>🎬 QuickShow</h1>

      <AddMovie 
      fetchMovies = {fetchMovies}
      editMovie = {editMovie}
      setEditMovie = {setEditMovie}

      />

      <hr />

     <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "20px",
      marginTop: "20px"
    }}>
      {movies.map((movie, index) => (
          
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px"
          }}
        >
          <img 
          src= {movie.posterUrl}
          alt= {movie.title}
          style={{
            width:"100%",
            height:"200px",
            objectFit:"cover",
            borderRadius:"8px"
          }}
          />
          <h2>🎬 {movie.title}</h2>
          <p>{movie.description}</p>
          <button onClick={() => setEditMovie(movie)}>Edit✏️</button>
          <button onClick={()=> deleteMovie(movie._id)}>Delete❌</button>
        </div>
      ))}
    </div>
    </div>
  );
}

export default App;