import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../Language";
import "../styles/OwnerDashboard.css";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { language } = useLanguage();

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
      <h2>
        {language === "en"
          ? "Owner Dashboard"
          : "Tableau de Bord du Propriétaire"}
      </h2>
      <div className="button-container">
        <button
          className="dashboard-button"
          onClick={() => navigate("/incoming-orders")}
        >
          {language === "en"
            ? "Check Incoming Orders"
            : "Vérifier les Commandes Entrantes"}
        </button>
        <button
          className="dashboard-button"
          onClick={() => navigate("/register")}
        >
          {language === "en"
            ? "Register Users"
            : "Enregistrer des Utilisateurs"}
        </button>
        <button
          className="dashboard-button"
          onClick={() => navigate("/edit-menu")}
        >
          {language === "en" ? "Edit Menu" : "Modifier le Menu"}
        </button>
        <button className="dashboard-button" onClick={handleLogout}>
          {language === "en" ? "Logout" : "Déconnexion"}
        </button>
      </div>
    </div>
  );
};

export default OwnerDashboard;
