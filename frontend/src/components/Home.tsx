import { useNavigate } from "react-router-dom";
import Card from "./Card";
import Header from "./Header";
import Intro from "./Intro";
import Footer from "./Footer";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (destination: string) => {
    navigate(destination);
  };

  return (
    <div>
      <Header />
      <Intro />
      <Card
        imageSrc="/src/assets/sandwich.jpg"
        altText="Grilled Sandwich"
        buttonText="Order Online"
        imageOnLeft={true}
        onClick={() => handleNavigation("/order")}
      />
      <Card
        imageSrc="/src/assets/salad.jpeg"
        altText="Salad"
        buttonText="View Menu"
        imageOnLeft={false}
        onClick={() => handleNavigation("/menu")}
      />
      <Card
        imageSrc="/src/assets/pastry.jpg"
        altText="Pastry"
        buttonText="Login"
        imageOnLeft={true}
        onClick={() => handleNavigation("/login")}
      />
      <Footer />
    </div>
  );
};

export default Home;
