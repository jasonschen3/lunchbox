import "./Card.css";
import { useLanguage } from "../Language.tsx";

interface CardProps {
  imageSrc: string;
  altText: string;
  buttonText: string;
  imageOnLeft: boolean;
}

function Card({ imageSrc, altText, buttonText, imageOnLeft }: CardProps) {
  const { language } = useLanguage();

  const translatedButtonText =
    language === "en" ? buttonText : translateButtonText(buttonText);

  function translateButtonText(text: string): string {
    switch (text) {
      case "Order Online":
        return "Commander en ligne";
      case "Salads":
        return "Salades";
      case "View Menu":
        return "Voir le menu";
      default:
        return text;
    }
  }

  return (
    <div className="card-container">
      {imageOnLeft ? (
        <>
          <img src={imageSrc} alt={altText} className="card-image" />
          <button className="card-button">{translatedButtonText}</button>
        </>
      ) : (
        <>
          <button className="card-button">{translatedButtonText}</button>
          <img src={imageSrc} alt={altText} className="card-image" />
        </>
      )}
    </div>
  );
}

export default Card;
