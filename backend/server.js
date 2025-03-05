import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import cors from "cors";

// Payment (import uppercase Stripe, lowercase is defined later)
import Stripe from "stripe";

// Routes
import authRouter from "./routes/auth.js";
import menuRouter from "./routes/menu.js";
import orderRouter from "./routes/orders.js";

env.config();
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.BACKEND_PORT;

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

app.use("/auth", authRouter);
app.use("/menu", menuRouter);
app.use("/order", orderRouter);

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

app.post("/submitOrder", async (req, res) => {
  const { customerName, email, items, totalPrice, date, selectedTime } =
    req.body;
  console.log("Received time:", selectedTime);

  try {
    const result = await db.query(
      "INSERT INTO orders (customer_name, email, items, total_price, date, time_expected) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        customerName,
        email,
        JSON.stringify(items),
        totalPrice,
        date,
        selectedTime,
      ]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error submitting order:", err);
    res.status(500).send("Internal server error");
  }
});

app.post("/create-checkout-session", async (req, res) => {
  const { items, success_url, cancel_url } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price, // Amount in cents (e.g., 5000 for €50.00)
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.FRONTEND_IP}success`,
      cancel_url: `${process.env.FRONTEND_IP}cancel`,
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.log("Error creating checkout session", error);
    res.status(500).send("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
