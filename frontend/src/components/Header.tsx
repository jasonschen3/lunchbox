import React from "react";
import "./Header.css";
import { useLanguage } from "../Language.tsx";

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
        <a href="#" className="nav-link active">
          {language === "en" ? "HOME" : "ACCUEIL"}
        </a>
        <a href="#" className="nav-link">
          {language === "en" ? "MENU" : "MENU"}
        </a>
        <a href="#" className="nav-link">
          {language === "en" ? "LOCATIONS" : "EMPLACEMENTS"}
        </a>
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
