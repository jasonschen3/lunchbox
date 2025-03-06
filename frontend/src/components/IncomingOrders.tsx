import axios from "axios";
import { BACKEND_IP } from "../constants";
import "../styles/IncomingOrders.css";
import Header from "./Header.tsx";
import { useNavigate } from "react-router-dom";

import useSWR from "swr";

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
const fetcher = (url) => axios.get(url).then((res) => res.data);

const IncomingOrders: React.FC = () => {
  // Use SWR to fetch today's orders
  const {
    data: orders,
    error,
    isLoading,
  } = useSWR<OrderType[]>(`${BACKEND_IP}/orders/today`, fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <Header />
      <div className="incoming-orders-container">
        <h2>Incoming Orders</h2>

        {isLoading && <p>Loading orders...</p>}

        {error && <p>Error loading orders: {error.message}</p>}

        {orders && orders.length === 0 && <p>No orders for today.</p>}

        {orders && orders.length > 0 && (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Items</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Date</th>
                <th>Time Expected</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
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
                  <td>{order.status}</td>
                  <td>{order.date}</td>
                  <td>{order.time_expected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button className="back-button" onClick={goBack}>
          Back
        </button>
      </div>
    </>
  );
};

export default IncomingOrders;
