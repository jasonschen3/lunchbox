import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.tsx";
import Login from "./components/Login.tsx";
// import OwnerDashboard from "./components/OwnerDashboard.tsx";
import OrderPage from "./components/OrderPage.tsx";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/owner" element={<OwnerDashboard />} /> */}
        <Route path="/order" element={<OrderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
