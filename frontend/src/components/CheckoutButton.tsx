import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { BACKEND_IP, STRIPE_PUBLISHABLE_KEY } from "../constants";
import "../styles/CheckoutButton.css";

// Fix the interface to match what OrderPage actually passes
interface CartItem {
  name: string; // Changed from id to name
  quantity: number;
  amount: number; // Changed from price to amount (Stripe uses amount in cents)
}

interface MetaData {
  customerName: string;
  email: string;
  totalPrice: number;
  date: string;
  selectedTime: string;
}

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const CheckoutButton: React.FC<{
  valid: boolean;
  items: CartItem[];
  metadata: MetaData;
  text: string;
}> = ({ valid, items, metadata, text }) => {
  const handleCheckout = async () => {
    if (!valid) {
      return;
    }

    const stripe = await stripePromise;
    if (!stripe) {
      console.error("Stripe failed to load");
      return;
    }

    try {
      const { data } = await axios.post(
        `${BACKEND_IP}/create-checkout-session`,
        {
          items,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/cancel`,
          metadata,
        }
      );

      const result = await stripe.redirectToCheckout({
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
    <button
      className={`checkout-button ${!valid ? "checkout-button-disabled" : ""}`}
      onClick={handleCheckout}
      disabled={!valid}
    >
      {text}
    </button>
  );
};

export default CheckoutButton;
