import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { BACKEND_IP, STRIPE_PUBLISHABLE_KEY } from "../constants";
import "../styles/CheckoutButton.css";

interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const CheckoutButton: React.FC<{ items: CartItem[]; text: string }> = ({
  items,
  text,
}) => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;

    try {
      const { data } = await axios.post(
        `${BACKEND_IP}/create-checkout-session`,
        {
          items,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/cancel`,
        }
      );

      const result = await stripe?.redirectToCheckout({
        sessionId: data.id,
      });

      if (result?.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <button className="checkout-button" onClick={handleCheckout}>
      {text}
    </button>
  );
};

export default CheckoutButton;
