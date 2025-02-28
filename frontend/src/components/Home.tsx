import React from "react";
import Card from "./Card";
import Header from "./Header";
import Intro from "./Intro";
import Footer from "./Footer";

const Home: React.FC = () => {
  return (
    <div>
      <Header />
      <Intro />
      <Card
        imageSrc="/src/assets/sandwich.png"
        altText="Grilled Sandwich"
        buttonText="Order Online"
        imageOnLeft={true}
      />
      <Card
        imageSrc="/src/assets/salad.png"
        altText="Salad"
        buttonText="Salads"
        imageOnLeft={false}
      />
      <Card
        imageSrc="/src/assets/donuts.jpg"
        altText="Donut"
        buttonText="View Menu"
        imageOnLeft={true}
      />
      <Footer />
    </div>
  );
};

export default Home;
