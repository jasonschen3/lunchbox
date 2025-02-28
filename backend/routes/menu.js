import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

router.get("/getMenu", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM menu WHERE available = TRUE");
    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching menu items:", err);
    res.status(500).send("Internal server error");
  }
});

export default router;
