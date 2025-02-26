import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-section">
        <h2>HOURS</h2>
        <p>Monday-Friday | 6:30 AM - 3:00 PM</p>
        <p>Saturday-Sunday | 7:00 AM - 3:00 PM</p>
      </div>

      <div className="footer-section locations">
        <h2>LOCATION</h2>
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
      </div>

      <div className="footer-section social-media">
        <h2>Social Media</h2>
        <a
          href="https://www.facebook.com/help/668969529866328/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our Facebook page"
        >
          <img src="/src/assets/meta.svg" alt="meta"></img>
        </a>
        <a
          href="https://www.instagram.com/your-handle"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our Instagram page"
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a
          href="https://www.yelp.com/your-business"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit our Yelp page"
        >
          <i className="fab fa-yelp"></i>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
