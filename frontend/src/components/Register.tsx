import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_IP } from "../constants";
import "../styles/Login.css"; // Reuse the styles from Login.css
import { useLanguage } from "../Language.tsx";
import Header from "./Header.tsx";

function Register() {
  const { language } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/unauthorized");
      return;
    }
  }, [token]);

  const goBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${BACKEND_IP}/auth/registerUser`,
        {
          username: username,
          password: password,
          email: email,
          phone_number: phoneNumber,
          is_admin: isAdmin,
        },
        { headers: { "access-token": token } }
      );

      if (response.status === 201) {
        setMessage(
          language === "en"
            ? "Registration successful! Redirecting to dashboard"
            : "Inscription réussie ! Redirection vers le tableau de bord"
        );
        setTimeout(() => {
          navigate("/owner");
        }, 2000);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.log("Error registering user", error);
      setMessage(
        language === "en"
          ? "Error registering user"
          : "Erreur lors de l'inscription de l'utilisateur"
      );
    }
  };

  return (
    <>
      <Header />
      <div className="login-container">
        <h2>
          {language === "en" ? "Register User" : "Inscrire un Utilisateur"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">
              {language === "en" ? "Username" : "Nom d'utilisateur"}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              {language === "en" ? "Password" : "Mot de passe"}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">
              {language === "en" ? "Phone Number" : "Numéro de téléphone"}
            </label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="isAdmin">
              {language === "en" ? "Admin" : "Administrateur"}
            </label>
            <select
              id="isAdmin"
              value={isAdmin ? "true" : "false"}
              onChange={(e) => setIsAdmin(e.target.value === "true")}
            >
              <option value="false">{language === "en" ? "No" : "Non"}</option>
              <option value="true">{language === "en" ? "Yes" : "Oui"}</option>
            </select>
          </div>
          <div className="button-group">
            <button type="submit" className="login-button">
              {language === "en" ? "Register" : "S'inscrire"}
            </button>
            <button
              type="button"
              onClick={goBack}
              className="login-button back-button"
            >
              {language === "en"
                ? "Back to Dashboard"
                : "Retour au Tableau de Bord"}
            </button>
          </div>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </>
  );
}

export default Register;
