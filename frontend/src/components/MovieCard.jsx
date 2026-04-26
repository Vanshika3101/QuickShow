import { useNavigate } from "react-router-dom";

function MovieCard({movie, setEditMovie, deleteMovie, toggleFavorite}){
    const navigate = useNavigate();

    return(
      <div className = "movie-card">
      <img
        src={movie.posterUrl}
        onClick={() => navigate(`/movie/${movie._id}`)}
        alt={movie.title}
        className="movie-img"
      />

      <h2>🎬 {movie.title}</h2>
      <p>{movie.description}</p>

      <button 
      className = "btn btn-edit"
      onClick = {()=> setEditMovie(movie)}>Edit ✏️</button>
      <button 
      className = "btn btn-delete"
      onClick={() => deleteMovie(movie._id)}>Delete ❌</button>
      <button 
      className = "btn"
      onClick ={() => toggleFavorite(movie._id)}>{movie.isFavorite ? "❤️" : "🤍"}</button>
    </div>
    );
} 

export default MovieCard;
