import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OwnerDashboard.css";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/unauthorized");
      return;
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="owner-dashboard-container">
      <h2>Owner Dashboard</h2>
      <div className="button-container">
        <button
          className="dashboard-button"
          onClick={() => navigate("/incoming-orders")}
        >
          Check Incoming Orders
        </button>
        <button
          className="dashboard-button"
          onClick={() => navigate("/register")}
        >
          Register Users
        </button>
        <button
          className="dashboard-button"
          onClick={() => navigate("/edit-menu")}
        >
          Edit Menu
        </button>
        <button className="dashboard-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default OwnerDashboard;
