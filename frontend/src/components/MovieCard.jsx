
function MovieCard({movie, setEditMovie, deleteMovie}){
    return(
        <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "10px",
        background: "#fff"
      }}
    >
      <img
        src={movie.posterUrl}
        alt={movie.title}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "8px"
        }}
      />

      <h2>🎬 {movie.title}</h2>
      <p>{movie.description}</p>

      <button onClick = {()=> setEditMovie(movie)}>Edit ✏️</button>
      <button onClick={() => deleteMovie(movie._id)}>Delete ❌</button>
    </div>
    );
} 

export default MovieCard;
