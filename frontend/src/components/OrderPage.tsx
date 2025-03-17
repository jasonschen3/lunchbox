import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_IP, OPENING_TIME, CLOSING_TIME } from "../constants";
import { useLanguage } from "../Language";
import CheckoutButton from "./CheckoutButton";
import "../styles/OrderPage.css";

import Header from "./Header";

interface MenuItem {
  item_id: number;
  name: string;
  description: string;
  french_description: string;
  price: number;
  available: boolean;
}

const OrderPage: React.FC = () => {
  const { language } = useLanguage();
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [totalPrice, setTotalPrice] = useState(0.0);
  const [message, setMessage] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [timeOptions, setTimeOptions] = useState<string[]>([]);
  const [valid, setValid] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState(0);

  // Maximum items allowed per order
  const MAX_ITEMS = 5;

  useEffect(() => {
    fetchMenu();
  }, []);

  // Add validation effect to check all required fields
  useEffect(() => {
    // Check if customer name is filled
    const isNameValid = customerName.trim().length > 0;

    // Check if email is valid using a simple regex pattern
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Check if time is selected
    const isTimeSelected = selectedTime.length > 0;

    // Check if at least one item is selected
    const hasItems = totalPrice > 0;

    // Set valid state based on all conditions
    setValid(isNameValid && isEmailValid && isTimeSelected && hasItems);
  }, [customerName, email, selectedTime, totalPrice]);

  const fetchMenu = async () => {
    try {
      const result = await axios.get(`${BACKEND_IP}/menu/items/available`);
      setMenuItems(result.data);
    } catch (error) {
      console.log("Error fetching menu", error);
      setMessage(
        language === "en"
          ? "Error fetching menu"
          : "Erreur lors de la récupération du menu"
      );
    }
  };

  const handleQuantityChange = (itemId: number, quantity: number) => {
    const currentQuantity = quantities[itemId] || 0;
    const quantityDifference = quantity - currentQuantity;
    const newTotalQuantity = totalQuantity + quantityDifference;

    // Check if the new total would exceed the maximum
    if (newTotalQuantity > MAX_ITEMS) {
      setMessage(
        language === "en"
          ? `You can only order a maximum of ${MAX_ITEMS} items in total.`
          : `Vous ne pouvez commander qu'un maximum de ${MAX_ITEMS} articles au total.`
      );
      return;
    }

    // Clear any error message when a valid selection is made
    if (message.includes(MAX_ITEMS.toString())) {
      setMessage("");
    }

    // Update quantities and total
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: quantity,
    }));

    setTotalQuantity(newTotalQuantity);
  };

  useEffect(() => {
    const calculateTotalPrice = () => {
      let total = 0;
      menuItems.forEach((item) => {
        const quantity = quantities[item.item_id] || 0;
        total += item.price * quantity;
      });
      setTotalPrice(total);
    };

    calculateTotalPrice();
  }, [quantities, menuItems]);

  useEffect(() => {
    const generateTimeOptions = () => {
      const times = [];

      // Get current time (local system's time, but this app is only used in FR)
      const currentDate = new Date();

      // Add 15 minutes to current time (minimum preparation time)
      const minimumOrderTime = new Date(currentDate.getTime() + 15 * 60 * 1000);

      const openingTime = new Date();
      const [openingHour, openingMinute] = OPENING_TIME.split(":").map(Number);
      openingTime.setHours(openingHour, openingMinute, 0, 0);

      const closingTime = new Date();
      const [closingHour, closingMinute] = CLOSING_TIME.split(":").map(Number);
      closingTime.setHours(closingHour, closingMinute, 0, 0);

      // Start time will be when the order can be started
      const startTime = new Date(
        Math.max(openingTime.getTime(), minimumOrderTime.getTime())
      );

      // Round starttime up to next 15-min interval
      const minutes = startTime.getMinutes();
      const remainder = minutes % 15;

      if (remainder > 0) {
        startTime.setMinutes(minutes + (15 - remainder));
      }

      // Generate timeslots with starttime instead of pure opening time
      while (startTime <= closingTime) {
        const timeString = startTime.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });
        times.push(timeString);
        startTime.setMinutes(startTime.getMinutes() + 15);
      }

      setTimeOptions(times);
    };

    generateTimeOptions();

    // Set up a timer to refresh time options every minute
    const intervalId = setInterval(generateTimeOptions, 60000); // 60000 ms = 1 minute

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const getCurrentDateInMetz = () => {
    // Get current date in Paris timezone
    const today = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    // Get date parts to create ISO format
    const parts = formatter.formatToParts(today);
    let month = "",
      day = "",
      year = "";

    for (const part of parts) {
      switch (part.type) {
        case "month":
          month = part.value;
          break;
        case "day":
          day = part.value;
          break;
        case "year":
          year = part.value;
          break;
      }
    }

    // Return in YYYY-MM-DD format for PostgreSQL
    return `${year}-${month}-${day}`;
  };

  const date = getCurrentDateInMetz();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!valid) {
      setMessage(
        language === "en"
          ? "Please fill in all required fields and select at least one item."
          : "Veuillez remplir tous les champs requis et sélectionner au moins un article."
      );
      return;
    }

    setMessage(
      language === "en" ? "Continuing to checkout" : "Passer à la caisse"
    );
  };

  return (
    <>
      <Header />
      <div className="order-page-container">
        <h2>
          {language === "en" ? "Place Your Order" : "Passez votre commande"}
        </h2>

        <div className="order-limits-info">
          <p>
            {language === "en"
              ? `Maximum ${MAX_ITEMS} items per order (${totalQuantity}/${MAX_ITEMS} selected)`
              : `Maximum ${MAX_ITEMS} articles par commande (${totalQuantity}/${MAX_ITEMS} sélectionné)`}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="customerName">
              {language === "en" ? "Name" : "Nom"}
            </label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="time">
              {language === "en" ? "Select Time" : "Sélectionnez l'heure"}
            </label>
            <select
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
            >
              <option value="" disabled>
                {language === "en" ? "Select a time" : "Sélectionnez une heure"}
              </option>
              {timeOptions.length === 0 && (
                <option value="" disabled>
                  {language === "en"
                    ? "Come back tomorrow!"
                    : "Reviens demain!"}
                </option>
              )}
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <table className="menu-table">
            <thead>
              <tr>
                <th>{language === "en" ? "Item" : "Article"}</th>
                <th>{language === "en" ? "Description" : "Description"}</th>
                <th>{language === "en" ? "Price" : "Prix"}</th>
                <th>{language === "en" ? "Quantity" : "Quantité"}</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.item_id}>
                  <td>{item.name}</td>
                  <td>
                    {language === "en"
                      ? item.description
                      : item.french_description}
                  </td>
                  <td>€{item.price}</td>
                  <td>
                    <select
                      value={quantities[item.item_id] || 0}
                      onChange={(e) =>
                        handleQuantityChange(
                          item.item_id,
                          parseInt(e.target.value)
                        )
                      }
                      className={
                        totalQuantity >= MAX_ITEMS &&
                        !(quantities[item.item_id] > 0)
                          ? "quantity-disabled"
                          : ""
                      }
                      disabled={
                        totalQuantity >= MAX_ITEMS &&
                        !(quantities[item.item_id] > 0)
                      }
                    >
                      {[
                        ...Array(
                          Math.min(
                            6,
                            MAX_ITEMS +
                              1 -
                              (totalQuantity - (quantities[item.item_id] || 0))
                          )
                        ).keys(),
                      ].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="form-group">
            <label htmlFor="totalPrice">
              {language === "en" ? "Total Price" : "Prix total"}
            </label>
            <input
              type="number"
              id="totalPrice"
              value={totalPrice.toFixed(2)}
              readOnly
            />
          </div>
          <CheckoutButton
            valid={valid}
            items={menuItems
              .filter((item) => quantities[item.item_id] > 0)
              .map((item) => ({
                name: item.name,
                quantity: quantities[item.item_id],
                amount: Math.round(item.price * 100), // Price in stripe is in cents
              }))}
            metadata={{
              customerName,
              email,
              totalPrice,
              date,
              selectedTime,
            }}
            text={language === "en" ? "Checkout" : "Vérifier"}
          />
          {!valid && (
            <p className="validation-message">
              {language === "en"
                ? "Please complete all required fields and select at least one item"
                : "Veuillez remplir tous les champs requis et sélectionner au moins un article"}
            </p>
          )}
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </>
  );
};

export default OrderPage;
