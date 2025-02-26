import React from "react";
import "./Intro.css";

const Intro: React.FC = () => {
  return (
    <div className="intro-container">
      <div className="logo-box">
        <img
          src="/main-body-logo.png"
          alt="The French Press Logo"
          className="logo"
        />
      </div>
    </div>
  );
};

export default Intro;
