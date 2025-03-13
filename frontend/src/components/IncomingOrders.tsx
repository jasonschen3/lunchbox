import { useEffect } from "react";
import axios from "axios";
import { BACKEND_IP } from "../constants";
import "../styles/IncomingOrders.css";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../Language";

import useSWR, { mutate } from "swr";

interface OrderType {
  order_id: string;
  customer_name: string;
  email: string;
  items: { name: string; quantity: number }[];
  total_price: number;
  status: string;
  date: string;
  time_expected: string;
}

// Fetcher function for SWR
const fetcher = (url: string) => {
  const token = localStorage.getItem("token");
  return axios
    .get(url, {
      headers: {
        "access-token": token,
      },
    })
    .then((res) => res.data);
};

const IncomingOrders: React.FC = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    if (!token) {
      navigate("/unauthorized");
      return;
    }
  }, [token]);

  // Use SWR to fetch today's orders
  const {
    data: orders,
    error,
    isLoading,
  } = useSWR<OrderType[]>(`${BACKEND_IP}/orders/today`, fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const goBack = () => {
    navigate(-1);
  };

  // Handle status update
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await axios.patch(
        `${BACKEND_IP}/orders/${orderId}/status`,
        {
          status: newStatus,
        },
        { headers: { "access-token": localStorage.getItem("token") } }
      );

      // Refresh the data after updating
      mutate(`${BACKEND_IP}/orders/today`);
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // Get the next status based on current status
  const getNextStatus = (currentStatus: string): string => {
    switch (currentStatus) {
      case "pending":
        return "preparing";
      case "preparing":
        return "completed";
      default:
        return currentStatus;
    }
  };

  // Get button text based on current status
  const getButtonText = (currentStatus: string): string => {
    if (language === "en") {
      return currentStatus === "pending" ? "Start Preparing" : "Mark Completed";
    } else {
      return currentStatus === "pending"
        ? "Commencer Préparation"
        : "Marquer Terminé";
    }
  };

  // Translate status for display
  const translateStatus = (status: string): string => {
    if (language === "en") return status;

    switch (status) {
      case "pending":
        return "en attente";
      case "preparing":
        return "en préparation";
      case "completed":
        return "terminé";
      default:
        return status;
    }
  };

  // Format date to remove time (YYYY-MM-DD)
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    // If it's an ISO date (contains T)
    if (dateString.includes("T")) {
      return dateString.split("T")[0];
    }
    // If it's already just a date
    return dateString;
  };

  // Format time to remove seconds (HH:MM)
  const formatTime = (timeString: string): string => {
    if (!timeString) return "";
    // If it includes seconds
    if (timeString.includes(":")) {
      const parts = timeString.split(":");
      if (parts.length >= 2) {
        return `${parts[0]}:${parts[1]}`;
      }
    }
    return timeString;
  };

  // Get CSS class for status
  const getStatusClass = (status: string): string => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "preparing":
        return "status-preparing";
      case "completed":
        return "status-completed";
      default:
        return "";
    }
  };

  return (
    <>
      <Header />
      <div className="incoming-orders-container">
        <h2>{language === "en" ? "Incoming Orders" : "Commandes Entrantes"}</h2>

        {isLoading && (
          <p>
            {language === "en"
              ? "Loading orders..."
              : "Chargement des commandes..."}
          </p>
        )}

        {error && (
          <p className="error-message">
            {language === "en"
              ? `Error loading orders: ${error.message}`
              : `Erreur lors du chargement des commandes: ${error.message}`}
          </p>
        )}

        {orders && orders.length === 0 && (
          <p>
            {language === "en"
              ? "No orders for today."
              : "Pas de commandes pour aujourd'hui."}
          </p>
        )}

        {orders && orders.length > 0 && (
          <table className="orders-table">
            <thead>
              <tr>
                <th>{language === "en" ? "Order ID" : "ID de Commande"}</th>
                <th>{language === "en" ? "Customer Name" : "Nom du Client"}</th>
                <th>Email</th>
                <th>{language === "en" ? "Items" : "Articles"}</th>
                <th>{language === "en" ? "Total Price" : "Prix Total"}</th>
                <th>{language === "en" ? "Status" : "Statut"}</th>
                <th>{language === "en" ? "Date" : "Date"}</th>
                <th>{language === "en" ? "Time Expected" : "Heure Prévue"}</th>
                <th>{language === "en" ? "Action" : "Action"}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.order_id}
                  className={getStatusClass(order.status)}
                >
                  <td>{order.order_id}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.email}</td>
                  <td>
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {item.name} x {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>${order.total_price}</td>
                  <td className={`status ${getStatusClass(order.status)}`}>
                    {translateStatus(order.status)}
                  </td>
                  <td>{formatDate(order.date)}</td>
                  <td>{formatTime(order.time_expected)}</td>
                  <td>
                    {order.status !== "completed" && (
                      <button
                        className="status-button"
                        onClick={() =>
                          updateOrderStatus(
                            order.order_id,
                            getNextStatus(order.status)
                          )
                        }
                      >
                        {getButtonText(order.status)}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button className="back-button" onClick={goBack}>
          {language === "en" ? "Back" : "Retour"}
        </button>
      </div>
    </>
  );
};

export default IncomingOrders;
