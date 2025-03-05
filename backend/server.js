import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import cors from "cors";

// Routes
import authRouter from "./routes/auth.js";
import menuRouter from "./routes/menu.js";
import orderRouter from "./routes/orders.js";

// Payment
import stripe from "stripe";

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
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: "{{PRICE_ID}}",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.FRONTEND_IP}?success=true`,
    cancel_url: `${process.env.FRONTEND_IP}?canceled=true`,
  });

  res.redirect(303, session.url);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
