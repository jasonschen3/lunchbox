import express from "express";
import pg from "pg";
import dotenv from "dotenv";

import jwt from "jsonwebtoken";
import { verifyToken } from "./auth.js";

dotenv.config();

const router = express.Router();
const secretKey = process.env.SESSION_KEY; // Used for auth

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

// Get all menu items
router.get("/items", verifyToken, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY item_id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching menu items:", err);
    res.status(500).send("Internal server error");
  }
});

// Get available menu items (for customers)
router.get("/items/available", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items WHERE available = TRUE");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching available menu items:", err);
    res.status(500).send("Internal server error");
  }
});

// Create new menu item
router.post("/items", verifyToken, async (req, res) => {
  const { name, description, french_description, price, available } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO items (name, description, french_description, price, available) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, description, french_description, price, available]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating menu item:", err);
    res.status(500).send("Internal server error");
  }
});

// Update menu item
router.put("/items/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, french_description, price, available } = req.body;

  try {
    const result = await db.query(
      "UPDATE items SET name = $1, description = $2, french_description = $3, price = $4, available = $5 WHERE item_id = $6 RETURNING *",
      [name, description, french_description, price, available, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Menu item not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating menu item:", err);
    res.status(500).send("Internal server error");
  }
});

// Update menu item availability
router.patch("/items/:id/availability", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { available } = req.body;

  try {
    const result = await db.query(
      "UPDATE items SET available = $1 WHERE item_id = $2 RETURNING *",
      [available, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Menu item not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating menu item availability:", err);
    res.status(500).send("Internal server error");
  }
});

// Delete menu item
router.delete("/items/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM items WHERE item_id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Menu item not found");
    }

    res.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    console.error("Error deleting menu item:", err);
    res.status(500).send("Internal server error");
  }
});

export default router;
