import React, { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_IP, OPENING_TIME, CLOSING_TIME } from "../constants";
import { useLanguage } from "../Language.tsx";
import "./OrderPage.css";

interface MenuItem {
  items_id: number;
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

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const result = await axios.get(`${BACKEND_IP}/menu/items`);
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
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: quantity,
    }));
  };

  const calculateTotalPrice = () => {
    let total = 0;
    menuItems.forEach((item) => {
      const quantity = quantities[item.items_id] || 0;
      total += item.price * quantity;
    });
    setTotalPrice(total);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [quantities]);

  const getCurrentDateInMetz = () => {
    const options = {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const formatter = new Intl.DateTimeFormat("en-GB", options);
    return formatter.format(new Date());
  };

  const generateTimeOptions = () => {
    const times = [];
    const openingTime = new Date();
    const [openingHour, openingMinute] = OPENING_TIME.split(":").map(Number);
    openingTime.setHours(openingHour, openingMinute, 0, 0);

    const closingTime = new Date();
    const [closingHour, closingMinute] = CLOSING_TIME.split(":").map(Number);
    closingTime.setHours(closingHour, closingMinute, 0, 0);

    while (openingTime <= closingTime) {
      const timeString = openingTime.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
      times.push(timeString);
      openingTime.setMinutes(openingTime.getMinutes() + 15);
    }

    return times;
  };

  const date = getCurrentDateInMetz();

  // TODO
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Selecting time", selectedTime);
    if (totalPrice <= 0) {
      setMessage(
        language === "en"
          ? "Total price must be greater than 0."
          : "Le prix total doit être supérieur à 0."
      );
      return;
    }

    const items = menuItems
      .filter((item) => quantities[item.items_id] > 0)
      .map((item) => ({
        items_id: item.items_id,
        name: item.name,
        quantity: quantities[item.items_id],
        price: item.price,
      }));
    console.log(selectedTime, "I");
    axios
      .post(`${BACKEND_IP}/submitOrder`, {
        customerName,
        email,
        items,
        totalPrice,
        date,
        selectedTime,
      })
      .then((res) => {
        if (res.status === 200) {
          setMessage(
            language === "en"
              ? "Order placed successfully!"
              : "Commande passée avec succès !"
          );
        } else {
          setMessage(
            language === "en"
              ? "Failed to place order. Please try again."
              : "Échec de la commande. Veuillez réessayer."
          );
        }
      })
      .catch((err) => {
        setMessage(
          language === "en"
            ? "An error occurred. Please try again later."
            : "Une erreur s'est produite. Veuillez réessayer plus tard."
        );
        console.log(err);
      });
  };

  return (
    <div className="order-page-container">
      <h2>
        {language === "en" ? "Place Your Order" : "Passez votre commande"}
      </h2>
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
            <option value="">
              {language === "en" ? "Select a time" : "Sélectionnez une heure"}
            </option>
            {generateTimeOptions().map((time) => (
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
              <tr key={item.items_id}>
                <td>{item.name}</td>
                <td>
                  {language === "en"
                    ? item.description
                    : item.french_description}
                </td>
                <td>${item.price}</td>
                <td>
                  <select
                    value={quantities[item.items_id] || 0}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.items_id,
                        parseInt(e.target.value)
                      )
                    }
                  >
                    {[...Array(6).keys()].map((num) => (
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
        <button type="submit" className="order-button">
          {language === "en" ? "Place Order" : "Passer la commande"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default OrderPage;
