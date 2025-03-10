import { useNavigate, useLocation } from "react-router-dom";
import "../styles/SuccessPage.css";
import { useLanguage } from "../Language";
import { useEffect, useState } from "react";

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    // Extract email from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get("email");

    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="success-container">
      <h1>{language === "en" ? "Payment Successful!" : "Paiement Réussi !"}</h1>
      <p>
        {language === "en"
          ? "Thank you for your order. Your payment has been processed successfully."
          : "Merci pour votre commande. Votre paiement a été traité avec succès."}
      </p>

      {email && (
        <p>
          {language === "en"
            ? `Confirmation email sent to: ${email}`
            : `Email de confirmation envoyé à: ${email}`}
        </p>
      )}

      <button className="home-button" onClick={handleGoHome}>
        {language === "en" ? "Go to Home" : "Retour à l'Accueil"}
      </button>
    </div>
  );
};

export default SuccessPage;
