import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {toast} from "react-toastify"
import { useEffect, useState } from "react";
import axios from "axios"
import {Routes, Route} from "react-router-dom"
import MovieDetail from "./components/MovieDetail";
import Signup from "./components/SignUp"
import Login from "./components/Login"
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ShowtimesPage from "./pages/ShowtimesPage";
import SelectSeatsPage from "./pages/SelectSeatsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import "./style.css";

function App(){
  const [movies, setMovies] = useState([]);
  const [editMovie, setEditMovie] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFav, setShowFav] = useState(false);
  const [sortType, setSortType] = useState("latest")
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
    <Navbar />

    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/" 
        element = {
          <HomePage
            movies={movies}
            search={search}
            setSearch={setSearch}
            sortType={sortType}
            setSortType={setSortType}
            showFav={showFav}
            setShowFav={setShowFav}
            loading={loading}
            fetchMovies={fetchMovies}
            editMovie={editMovie}
            setEditMovie={setEditMovie}
            deleteMovie={deleteMovie}
            toggleFavorite={togglefavorite}
          />
        }
    />

    <Route 
    path="/movies/:id"
    element={<MovieDetail/>} 
    />
    <Route
    path="/movies/:id/shows"
    element={
      <ProtectedRoute>
        <ShowtimesPage />
      </ProtectedRoute>
    }
    />
    <Route
    path="/book/:showId"
    element={
      <ProtectedRoute>
        <SelectSeatsPage />
      </ProtectedRoute>
    }
    />
    <Route
    path="/my-bookings"
    element={
      <ProtectedRoute>
        <MyBookingsPage />
      </ProtectedRoute>
    }
    />
  </Routes>
  </>
  );
}

export default App;