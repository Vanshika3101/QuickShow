import { useEffect, useState } from "react";
import axios from "axios"
import AddMovie from "./components/AddMovie";
import MovieCard from "./components/MovieCard";

function App(){
  const [movies, setMovies] = useState([]);
  const [editMovie, setEditMovie] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  
  const fetchMovies = () => {
    setLoading(true);
    axios.get("https://quickshow-jn4r.onrender.com/api/movies")
    .then(res => setMovies(res.data))
    .catch(err => console.log(err))
    .finally(() => setLoading(false));
  }

  const deleteMovie = (id) => {
    axios.delete(`https://quickshow-jn4r.onrender.com/api/movies/delete/${id}`)
    .then(() => {
      fetchMovies(); //refresh list
    })
    .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div >
      <h1>🎬 QuickShow</h1>

      <AddMovie 
      fetchMovies = {fetchMovies}
      editMovie = {editMovie}
      setEditMovie = {setEditMovie}
      />

      <input 
      type="text" 
      placeholder = "🔍 Search movies..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        padding: "8px",
        marginBottom: "15px",
        width: "250px"
      }}
      />

      <hr />

      {loading ? (
      <p>⏳ Loading movies...</p>
    ) : filteredMovies.length > 0 ? (
      filteredMovies.map((movie) => (
        <MovieCard
          key={movie._id}
          movie={movie}
          setEditMovie={setEditMovie}
          deleteMovie={deleteMovie}
        />
      ))
    ) : (
      <p>🎥 No movies found</p>
    )}
    
    </div>
  );
}

export default App;