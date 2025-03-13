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
        imageSrc="/sandwich.jpg"
        altText="Grilled Sandwich"
        buttonText="Order Online"
        imageOnLeft={true}
        onClick={() => handleNavigation("/order")}
      />
      <Card
        imageSrc="/salad.jpeg"
        altText="Salad"
        buttonText="View Menu"
        imageOnLeft={false}
        onClick={() => handleNavigation("/menu")}
      />
      <Card
        imageSrc="/pastry.jpg"
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
