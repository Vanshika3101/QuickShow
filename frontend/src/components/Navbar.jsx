import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        padding: "12px 20px",
        borderBottom: "1px solid #ddd",
        marginBottom: "12px",
      }}
    >
      <Link to="/">Home</Link>
      <Link to="/my-bookings">My Bookings</Link>
      {!token ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      ) : (
        <button onClick={handleLogout}>Logout</button>
      )}
    </div>
  );
}

export default Navbar;
