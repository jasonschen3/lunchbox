import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pg from "pg";
import dotenv from "dotenv";

// Key component
const router = express.Router();

dotenv.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

const secretKey = process.env.SESSION_KEY;
const saltRounds = 10;

function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    permission_level: user.permission_level,
  };
  const options = { expiresIn: "2h" };
  return jwt.sign(payload, secretKey, options);
}

function verifyToken(req, res, next) {
  const token = req.headers["access-token"];
  if (!token) {
    return res.status(403).send("No token provided");
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(500).send("Failed to authenticate token");
    }
    req.user = decoded;
    next();
  });
}

function checkPermission() {
  return (req, res, next) => {
    const isAdmin = req.user.is_admin;
    if (isAdmin) {
      next();
    } else {
      res
        .status(403)
        .json({ message: "You do not have the required permission level" });
    }
  };
}

async function comparePassword(plainPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
}

router.get("/test", async (req, res) => {
  res.send("test");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Attempting login", username);
  try {
    console.log("I'm trying");
    const result = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;

      // const valid = await comparePassword(password, storedHashedPassword);
      // Testing purposes
      const valid = password == storedHashedPassword;

      if (valid) {
        const token = generateToken(user);
        return res.status(200).json({ token });
      } else {
        return res.status(401).send("Invalid credentials");
      }
    } else {
      return res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).send("Internal server error");
  }
});

router.post(
  "/registerUser",
  verifyToken,
  checkPermission(),
  async (req, res) => {
    const { username, password, permission_level, name, title, upload_url } =
      req.body;

    try {
      const checkResult = await db.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );

      if (checkResult.rows.length > 0) {
        return res.status(409).json({ message: "Username already exists" });
      }

      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({ message: "Error hashing password" });
        }

        const userResult = await db.query(
          "INSERT INTO users (username, password, permission_level, upload_url, name, title) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
          [username, hash, permission_level, upload_url, name, title]
        );

        if (userResult.rows.length > 0) {
          return res.status(201).json({ message: "Registration successful" });
        } else {
          return res.status(500).json({ message: "Registration failed" });
        }
      });
    } catch (err) {
      console.error("Server error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
