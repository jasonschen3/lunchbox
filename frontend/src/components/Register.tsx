import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BACKEND_IP } from "../constants";
import "../styles/Login.css"; // Reuse the styles from Login.css

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/unauthorized");
      return;
    }
  }, [token]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${BACKEND_IP}/auth/registerUser`,
        {
          username: username,
          password: password,
          email: email,
          phone_number: phoneNumber,
          is_admin: isAdmin,
        },
        { headers: { "access-token": token } }
      );
      console.log("hi");
      if (response.status === 201) {
        setMessage("Registration successful! Redirecting to dashboard");
        setTimeout(() => {
          navigate("/owner");
        }, 2000);
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.log("Error registering user", error);
      setMessage("Error registering user");
    }
  };

  return (
    <div className="login-container">
      <h2>Register User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="isAdmin">Admin</label>
          <select
            id="isAdmin"
            value={isAdmin ? "true" : "false"}
            onChange={(e) => setIsAdmin(e.target.value === "true")}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <button type="submit" className="login-button">
          Register
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Register;
