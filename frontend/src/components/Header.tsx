import React from "react";
import "./Header.css";
import { useLanguage } from "../Language.tsx";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value as "en" | "fr");
  };

  return (
    <header className="header">
      <h1 className="logo">Lunchbox</h1>
      <nav className="nav-menu">
        <Link to="/" className="nav-link active">
          {language === "en" ? "HOME" : "ACCUEIL"}
        </Link>
        <Link to="/menu" className="nav-link">
          {language === "en" ? "MENU" : "MENU"}
        </Link>
        <Link to="/order" className="nav-link">
          {language === "en" ? "ORDER" : "COMMANDER"}
        </Link>
        <Link to="/login" className="nav-link">
          {language === "en" ? "LOGIN" : "CONNEXION"}
        </Link>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="language-switcher"
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </nav>
    </header>
  );
};

export default Header;
