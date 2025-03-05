import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.tsx";
import Login from "./components/Login.tsx";
import OwnerDashboard from "./components/OwnerDashboard.tsx";
import OrderPage from "./components/OrderPage.tsx";
import Unauthorized from "./components/Unauthorized.tsx";
import Register from "./components/Register.tsx";
import Menu from "./components/Menu.tsx";
import SuccessPage from "./components/SuccessPage.tsx";
import CancelPage from "./components/CancelPage.tsx";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
