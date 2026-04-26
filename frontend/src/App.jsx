import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import axios from "axios"
import AddMovie from "./components/AddMovie";
import MovieCard from "./components/MovieCard";
import {Routes, Route} from "react-router-dom"
import MovieDetail from "./components/MovieDetail";
import "./styles.css";

function App(){
  const [movies, setMovies] = useState([]);
  const [editMovie, setEditMovie] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFav, setShowFav] = useState(false);
  const [sortType, setSortType] = useState("latest")
  const [visible, setVisible] = useState(6);

  const fetchMovies = () => {
    setLoading(true);
    axios.get("https://quickshow-jn4r.onrender.com/api/movies")
    .then(res => setMovies(res.data))
    .catch(err => console.log(err))
    .finally(() => setLoading(false));
  }

  const deleteMovie = (id) => {
    const token = localStorage.getItem("token");
    axios.delete(`https://quickshow-jn4r.onrender.com/api/movies/delete/${id}`,{
      headers:{
        Authorization : `Bearer ${token}`,
      },
    })
    .then(() => {
      toast.success("Movie Deleted ❌");
      fetchMovies(); //refresh list
    })
    .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  //search filter
  let filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  //favorite filter
  if(showFav){
    filteredMovies = filteredMovies.filter((m) => m.isFavorite);
  }

  //sorted movies
  const sortedMovies = [...filteredMovies].sort((a,b)=>{
    if(sortType === "az"){
      return a.title.localeCompare(b.title);
    }
    if(sortType === "za"){
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  const visibleMovies = sortedMovies.slice(0,visible);
  
  //toggle favorite
  const togglefavorite = (id) => {
    const token = localStorage.getItem("token");

    axios.put(`https://quickshow-jn4r.onrender.com/api/movies/favorite/${id}`,
      {},
      {
        headers:{
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(()=>fetchMovies())
    .catch(err => console.log(err));
  };

  return (
    <>
    <ToastContainer position="top-right" autoClose={2000} />

    <Routes>
      <Route
        path="/" 
        element = {
          <div>
          <h1>🎬 QuickShow</h1>
          
          <AddMovie
            fetchMovies={fetchMovies}
            editMovie={editMovie}
            setEditMovie={setEditMovie}
          />
          
          <br />
          
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
          
       //sort movies
      <select 
        value={sortType}
        onChange={(e) => setSortType(e.target.value)}
      >
        <option value="latest">Latest</option>
        <option value="az">A-Z</option>
        <option value="za">Z-A</option>
      </select>

      //favorite button
      <button onClick={() => setShowFav(!showFav)}>
        {showFav ? "Show All 🎬" : "Show Favorites ❤️"}
      </button>

       {loading ? (
                <p>Loading...</p>
              ) : (
                visibleMovies.map((movie) => (
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    setEditMovie={setEditMovie}
                    deleteMovie={deleteMovie}
                    toggleFavorite={togglefavorite}
                  />
                ))
              )}
          </div>
        }
    />

    <Route 
    path="/movie/:id"
    element={<MovieDetail/>} 
    />
  </Routes>
  </>
  );
}

export default App;