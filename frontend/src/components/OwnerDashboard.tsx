import { useEffect, useState } from "react";
import io from "socket.io-client";
import { BACKEND_IP } from "../constants";
import Order from "./Order";

interface OrderType {
  id: string;
  customerName: string;
  items: string[];
  totalPrice: number;
  status: string;
}

const socket = io(BACKEND_IP);

const OwnerDashboard = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);

  useEffect(() => {
    // Listen for new orders
    socket.on("orderUpdate", (newOrder) => {
      console.log("New order received:", newOrder); // Log the new order for debugging
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
    });

    return () => {
      socket.off("orderUpdate");
    };
  }, []);

  return (
    <div>
      <h2>Incoming Orders</h2>
      {orders.map((order) => (
        <Order
          key={order.id}
          customerName={order.customerName}
          items={order.items}
          totalPrice={order.totalPrice}
          status={order.status}
        />
      ))}
    </div>
  );
};

export default OwnerDashboard;
