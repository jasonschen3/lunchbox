import React from "react";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Welcome to Lunchbox</h1>
        <p className="tagline">Fresh, Delicious Sandwiches Made Daily</p>
      </header>

      <section className="features">
        <div className="feature-card">
          <h2>Fresh Ingredients</h2>
          <p>Locally sourced, premium quality ingredients</p>
        </div>
        <div className="feature-card">
          <h2>Custom Orders</h2>
          <p>Build your perfect sandwich</p>
        </div>
        <div className="feature-card">
          <h2>Fast Service</h2>
          <p>Ready in minutes</p>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Order?</h2>
        <button className="order-button">Order Now</button>
      </section>

      <footer className="hours-location">
        <div>
          <h3>Hours</h3>
          <p>Mon-Fri: 11am - 8pm</p>
          <p>Sat-Sun: 12pm - 6pm</p>
        </div>
        <div>
          <h3>Location</h3>
          <p>123 Sandwich Street</p>
          <p>Foodtown, ST 12345</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
