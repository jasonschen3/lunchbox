import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { useLanguage } from "../Language.tsx";
import { BACKEND_IP } from "../constants.ts";

const Login: React.FC = () => {
  const { language } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Attempting login", username);
    axios
      .post(`${BACKEND_IP}/auth/login`, {
        username: username,
        password: password,
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          navigate("/owner");
        } else {
          setMessage(
            language === "en" ? "Wrong credentials" : "Identifiants incorrects"
          );
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          setMessage(
            language === "en"
              ? "Invalid credentials. Please try again."
              : "Identifiants invalides. Veuillez réessayer."
          );
        } else {
          setMessage(
            language === "en"
              ? "An error occurred. Please try again later."
              : "Une erreur s'est produite. Veuillez réessayer plus tard."
          );
        }
      });
  };

  return (
    <div className="login-container">
      <h2>{language === "en" ? "Login" : "Connexion"}</h2>
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
        <button type="submit" className="login-button">
          {language === "en" ? "Login" : "Connexion"}
        </button>
      </form>
      {message && <p className="mt-3 text-danger">{message}</p>}
    </div>
  );
};

export default Login;
