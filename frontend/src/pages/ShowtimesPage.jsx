import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function ShowtimesPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchShows = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://quickshow-jn4r.onrender.com/api/shows/movie/${id}`
      );
      setShows(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch showtimes");
    } finally {
      setLoading(false);
    }
  };

  const seedShows = async () => {
    try {
      setLoading(true);
      await axios.post(`https://quickshow-jn4r.onrender.com/api/shows/seed/${id}`);
      toast.success("Showtimes created");
      await fetchShows();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to seed showtimes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Select Showtime</h2>

      <button onClick={() => navigate(`/movies/${id}`)}>Back to Movie</button>

      <div style={{ marginTop: "15px" }}>
        {loading ? (
          <p>Loading...</p>
        ) : shows.length === 0 ? (
          <div>
            <p>No showtimes found for this movie.</p>
            <button onClick={seedShows}>Create Sample Showtimes</button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "12px", marginTop: "10px" }}>
            {shows.map((show) => (
              <div
                key={show._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "12px",
                  maxWidth: "520px",
                }}
              >
                <h3 style={{ margin: 0 }}>{show.theater}</h3>
                <p style={{ margin: "6px 0" }}>
                  {show.date} • {show.time}
                </p>
                <p style={{ margin: "6px 0" }}>Price: ₹{show.price}</p>
                <button onClick={() => navigate(`/book/${show._id}`)}>
                  Book Seats
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShowtimesPage;
