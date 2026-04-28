import AddMovie from "../components/AddMovie";
import MovieCard from "../components/MovieCard";

function HomePage({
  movies,
  search,
  setSearch,
  sortType,
  setSortType,
  showFav,
  setShowFav,
  loading,
  fetchMovies,
  editMovie,
  setEditMovie,
  deleteMovie,
  toggleFavorite,
}) {
  let filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  if (showFav) {
    filteredMovies = filteredMovies.filter((movie) => movie.isFavorite);
  }

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortType === "az") {
      return a.title.localeCompare(b.title);
    }

    if (sortType === "za") {
      return b.title.localeCompare(a.title);
    }

    return 0;
  });

  return (
    <div>
      <h1>🎬 QuickShow</h1>

      <AddMovie
        fetchMovies={fetchMovies}
        editMovie={editMovie}
        setEditMovie={setEditMovie}
      />

      <br /> <br />

      <input
        type="text"
        placeholder="🔍 Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "8px",
          marginBottom: "15px",
          width: "250px",
        }}
      />

      <br /> <br />

      <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
        <option value="latest">Latest</option>
        <option value="az">A-Z</option>
        <option value="za">Z-A</option>
      </select>

      <br /> <br />

      <button onClick={() => setShowFav(!showFav)}>
        {showFav ? "Show All 🎬" : "Show Favorites ❤️"}
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        sortedMovies.map((movie) => (
          <MovieCard
            key={movie._id}
            movie={movie}
            setEditMovie={setEditMovie}
            deleteMovie={deleteMovie}
            toggleFavorite={toggleFavorite}
          />
        ))
      )}
    </div>
  );
}

export default HomePage;
