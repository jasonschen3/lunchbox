import { useNavigate } from "react-router-dom";
import "../styles/Unauthorized.css";

function Unauthorized() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="unauthorized-container">
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <button className="login-button" onClick={handleLoginRedirect}>
        Go to Login
      </button>
    </div>
  );
}

export default Unauthorized;
