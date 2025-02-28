// import { useEffect, useState } from "react";
// import io from "socket.io-client";
// import { BACKEND_IP } from "../constants";

// const socket = io(BACKEND_IP);

// const OwnerDashboard = () => {
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     // Listen for new orders
//     socket.on("orderUpdate", (newOrder) => {
//       console.log("New order received:", newOrder); // Log the new order for debugging
//       setOrders((prevOrders) => [newOrder, ...prevOrders]);
//     });

//     return () => {
//       socket.off("orderUpdate");
//     };
//   }, []);

//   return (
//     <div>
//       <h2>Incoming Orders</h2>
//       {orders.map((order) => (
//         <div key={order.id}>
//           <p>{order.items ? order.items.join(", ") : "No items"}</p>
//           <p>Status: {order.status ? order.status : "No status"}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default OwnerDashboard;
