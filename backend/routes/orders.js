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
  try {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    // But DB stores it traditional format (not France format)
    // Convert YYYY-MM-DD to France format years-day-month
    // const [year, month, day] = today.split("-");
    // const franceFormatDate = `${year}-${day}-${month}`;

    const result = await db.query("SELECT * FROM orders WHERE date = $1", [
      today,
    ]);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching today's orders:", err);
    res.status(500).send("Internal server error");
  }
});

// Update order status
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Make sure status is one of the valid values
  if (!["pending", "preparing", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const result = await db.query(
      "UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).send("Internal server error");
  }
});

export default router;
