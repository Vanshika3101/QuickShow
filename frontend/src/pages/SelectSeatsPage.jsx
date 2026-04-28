import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

function SelectSeatsPage() {
  const navigate = useNavigate();
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [booking, setBooking] = useState(false);

  const token = localStorage.getItem("token");

  const allSeats = useMemo(() => {
    const rows = ["A", "B", "C", "D"];
    const cols = [1, 2, 3, 4, 5];
    const seats = [];
    for (const r of rows) {
      for (const c of cols) {
        seats.push(`${r}${c}`);
      }
    }
    return seats;
  }, []);

  const bookedSeats = useMemo(() => {
    return new Set(show?.bookedSeats || []);
  }, [show]);

  const totalAmount = useMemo(() => {
    const price = show?.price || 0;
    return selectedSeats.length * price;
  }, [selectedSeats.length, show?.price]);

  const fetchShow = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://quickshow-jn4r.onrender.com/api/shows/${showId}`
      );
      setShow(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load show");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showId]);

  const toggleSeat = (seat) => {
    if (bookedSeats.has(seat)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seat)) return prev.filter((s) => s !== seat);
      return [...prev, seat];
    });
  };

  const confirmBooking = async () => {
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error("Please select at least 1 seat");
      return;
    }

    try {
      setBooking(true);
      await axios.post(
        "https://quickshow-jn4r.onrender.com/api/bookings/create",
        { showId, seats: selectedSeats },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking confirmed");
      setSelectedSeats([]);
      await fetchShow(); // refresh booked seats
      navigate("/my-bookings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book seats");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Select Seats</h2>
      {loading ? (
        <p>Loading...</p>
      ) : !show ? (
        <p>Show not found</p>
      ) : (
        <>
          <p style={{ marginTop: "6px" }}>
            {show.theater} • {show.date} • {show.time} • ₹{show.price}/seat
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 56px)",
              gap: "10px",
              marginTop: "18px",
              marginBottom: "18px",
              alignItems: "center",
            }}
          >
            {allSeats.map((seat) => {
              const isBooked = bookedSeats.has(seat);
              const isSelected = selectedSeats.includes(seat);

              return (
                <button
                  key={seat}
                  onClick={() => toggleSeat(seat)}
                  disabled={isBooked}
                  style={{
                    height: "44px",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    cursor: isBooked ? "not-allowed" : "pointer",
                    background: isBooked ? "#eee" : isSelected ? "#c7f9cc" : "white",
                    fontWeight: 600,
                  }}
                >
                  {seat}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: "10px" }}>
            <p>
              Selected: {selectedSeats.length} • Total: ₹{totalAmount}
            </p>

            <button onClick={confirmBooking} disabled={booking}>
              {booking ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </>
      )}

      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );ac
}

export default SelectSeatsPage;
