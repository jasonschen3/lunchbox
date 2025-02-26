import "./Card.css";

interface CardProps {
  imageSrc: string;
  altText: string;
  buttonText: string;
  imageOnLeft: boolean;
}

function Card({ imageSrc, altText, buttonText, imageOnLeft }: CardProps) {
  return (
    <div className="card-container">
      {imageOnLeft ? (
        <>
          <img src={imageSrc} alt={altText} className="card-image" />
          <button className="card-button">{buttonText}</button>
        </>
      ) : (
        <>
          <button className="card-button">{buttonText}</button>
          <img src={imageSrc} alt={altText} className="card-image" />
        </>
      )}
    </div>
  );
}

export default Card;
