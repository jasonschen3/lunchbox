import React from "react";
import "../styles/Menu.css";

const Menu: React.FC = () => {
  return (
    <div className="menu-container">
      <h1>Our Menu</h1>
      <img src="/french-menu.jpg" alt="French Menu" className="menu-image" />
    </div>
  );
};

export default Menu;
