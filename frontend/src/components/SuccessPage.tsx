import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SuccessPage.css";

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="success-container">
      <h1>Payment Successful!</h1>
      <p>
        Thank you for your order. Your payment has been processed successfully.
      </p>
      <button className="home-button" onClick={handleGoHome}>
        Go to Home
      </button>
    </div>
  );
};

export default SuccessPage;
