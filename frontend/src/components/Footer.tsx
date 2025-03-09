import "../styles/Footer.css";
import { useLanguage } from "../Language.tsx";

function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="footer-container">
      <div className="footer-section">
        <h2>{language === "en" ? "HOURS" : "HEURES"}</h2>
        <p>
          {language === "en"
            ? "Monday-Friday | 7:30 AM - 2:00 PM"
            : "Lundi-Vendredi | 7h30 - 14h00"}
        </p>
        <p>
          {language === "en"
            ? "Saturday-Sunday | Closed"
            : "Samedi-Dimanche | Fermé"}
        </p>
      </div>

      <div className="footer-section locations">
        <h2>{language === "en" ? "LOCATION" : "EMPLACEMENT"}</h2>
        <div className="location">
          <h3>
            <em>Metz</em>
          </h3>
          <p>
            207 Avenue de Strasbourg
            <br />
            57070 Metz, France
          </p>
          <p className="phone">+33 3 87 65 69 29</p>
        </div>
      </div>

      <div className="footer-section social-media">
        <h2>{language === "en" ? "Social Media" : "Réseaux Sociaux"}</h2>
        <a
          href="https://m.facebook.com/Aux-petits-choux-sandwicherie-546491926267488/"
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
