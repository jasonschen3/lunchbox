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

router.get("/today", async (req, res) => {
  console.log("BACKEND ATTEMPTING TO GET ORDERS");
  try {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    // But DB stores it in france format // YYYY-DD-MM
    // Convert YYYY-MM-DD to YYYY-DD-MM
    const [year, month, day] = today.split("-");
    const franceFormatDate = `${year}-${day}-${month}`;

    const result = await db.query("SELECT * FROM orders WHERE date = $1", [
      franceFormatDate,
    ]);
    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching today's orders:", err);
    res.status(500).send("Internal server error");
  }
});

export default router;
