import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_IP } from "../constants";
import "./IncomingOrders.css";

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

const IncomingOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const result = await axios.get(`${BACKEND_IP}/orders/today`);
      setOrders(result.data);
    } catch (error) {
      console.error("Error fetching today's orders:", error);
    }
  };

  return (
    <div className="incoming-orders-container">
      <h2>Incoming Orders</h2>
      {orders.length === 0 ? (
        <p>No orders for today.</p>
      ) : (
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
                <td>${order.total_price.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>{order.date}</td>
                <td>{order.time_expected}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default IncomingOrders;
