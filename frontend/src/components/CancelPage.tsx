import { useNavigate } from "react-router-dom";
import "../styles/CancelPage.css";

const CancelPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="cancel-container">
      <h1>Payment Canceled</h1>
      <p>Your payment was canceled. Please try again.</p>
      <button className="home-button" onClick={handleGoHome}>
        Go to Home
      </button>
    </div>
  );
};

export default CancelPage;
