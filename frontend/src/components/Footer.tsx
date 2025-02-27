import React from "react";
import "./Footer.css";
import { useLanguage } from "../Language.tsx";

function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="footer-container">
      <div className="footer-section">
        <h2>{language === "en" ? "HOURS" : "HEURES"}</h2>
        <p>
          {language === "en"
            ? "Monday-Friday | 6:30 AM - 3:00 PM"
            : "Lundi-Vendredi | 6h30 - 15h00"}
        </p>
        <p>
          {language === "en"
            ? "Saturday-Sunday | 7:00 AM - 3:00 PM"
            : "Samedi-Dimanche | 7h00 - 15h00"}
        </p>
      </div>

      <div className="footer-section locations">
        <h2>{language === "en" ? "LOCATIONS" : "EMPLACEMENTS"}</h2>
        <div className="location">
          <h3>
            <em>Aurora</em>
          </h3>
          <p>
            15290 E Iliff Ave.
            <br />
            Aurora, CO 80014
          </p>
          <p className="phone">(303) 369-3111</p>
        </div>
        {/* Add other locations similarly */}
      </div>

      <div className="footer-section social-media">
        <h2>{language === "en" ? "Social Media" : "Réseaux Sociaux"}</h2>
        <a
          href="https://www.facebook.com/help/668969529866328/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={
            language === "en"
              ? "Visit our Facebook page"
              : "Visitez notre page Facebook"
          }
        >
          <img src="/src/assets/meta.svg" alt="meta"></img>
        </a>
        <a
          href="https://www.instagram.com/your-handle"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={
            language === "en"
              ? "Visit our Instagram page"
              : "Visitez notre page Instagram"
          }
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a
          href="https://www.yelp.com/your-business"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={
            language === "en"
              ? "Visit our Yelp page"
              : "Visitez notre page Yelp"
          }
        >
          <i className="fab fa-yelp"></i>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
