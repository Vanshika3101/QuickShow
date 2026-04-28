import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        "https://quickshow-jn4r.onrender.com/api/bookings/my-bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookings(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Bookings</h2>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings yet. Book your first show.</p>
      ) : (
        <div style={{ display: "grid", gap: "14px", marginTop: "16px" }}>
          {bookings.map((booking) => (
            <div
              key={booking._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "14px",
                maxWidth: "600px",
              }}
            >
              <h3 style={{ margin: 0 }}>{booking.movieTitle}</h3>
              <p style={{ margin: "6px 0" }}>
                {booking.theater} • {booking.date} • {booking.time}
              </p>
              <p style={{ margin: "6px 0" }}>
                Seats: {booking.seats?.join(", ")} | Amount: ₹{booking.totalAmount}
              </p>
              <p style={{ margin: "6px 0" }}>Status: {booking.status}</p>
            </div>
          ))}
        </div>
      )}

      <br />
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}

export default MyBookingsPage;
