import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import cors from "cors";

import { sendOrderConfirmationEmail } from "./utils.js";

// Payment (import uppercase Stripe, lowercase is defined later)
import Stripe from "stripe";

// Routes
import authRouter from "./routes/auth.js";
import menuRouter from "./routes/menu.js";
import orderRouter from "./routes/orders.js";

env.config();
const app = express();

// Webhook to listen for Stripe checkout Events (move before the express.json)
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed.", err.message);
      return res.status(400).send("Webhook Error");
    }

    // Submit order if completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Extract metadata
      const { customerName, email, items, totalPrice, date, selectedTime } =
        session.metadata;

      try {
        const result = await db.query(
          "INSERT INTO orders (customer_name, email, items, total_price, date, time_expected) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
          [customerName, email, items, totalPrice, date, selectedTime]
        );
        console.log("Order submitted:", result.rows[0]);
        const orderNumber = result.rows[0].order_id;

        // Send confirmation email with parsed items
        try {
          const parsedItems = JSON.parse(items);

          await sendOrderConfirmationEmail({
            customerName,
            email,
            items: parsedItems,
            totalPrice,
            date,
            selectedTime,
            orderNumber,
          });

          console.log("Confirmation email sent for order #", orderNumber);
        } catch (emailErr) {
          console.error("Error sending confirmation email:", emailErr);
        }
      } catch (err) {
        console.error("Error submitting order:", err);
      }
    }

    res.status(200).json({ received: true });
  }
);

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
app.use("/orders", orderRouter);

const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

app.post("/create-checkout-session", async (req, res) => {
  const { items } = req.body;
  const { customerName, email, totalPrice, date, selectedTime } =
    req.body.metadata;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: { name: item.name },
          unit_amount: item.amount, // Amount in cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${
        process.env.FRONTEND_IP
      }success?session_id={CHECKOUT_SESSION_ID}&email=${encodeURIComponent(
        email
      )}`,
      cancel_url: `${process.env.FRONTEND_IP}cancel`,
      metadata: {
        customerName,
        email,
        items: JSON.stringify(items), // Store order data in metadata
        totalPrice,
        date,
        selectedTime,
      },
    });

    // Return the session ID
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.log("Error creating checkout session", error);
    res.status(500).send("Internal server error");
  }
});

// Test endpoint for email functionality
app.post("/test-email", async (req, res) => {
  const { email } = req.body;

  try {
    const testOrderData = {
      customerName: "Test Customer",
      email: email || "test@example.com",
      items: [
        { name: "Test Sandwich", quantity: 2, amount: 850 },
        { name: "Test Salad", quantity: 1, amount: 650 },
      ],
      totalPrice: "23.50",
      date: "2025-03-10",
      selectedTime: "12:30",
      orderNumber: "TEST-" + Math.floor(1000 + Math.random() * 9000),
    };

    await sendOrderConfirmationEmail(testOrderData);
    res.status(200).json({ success: true, message: "Test email sent" });
  } catch (error) {
    console.error("Error sending test email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
