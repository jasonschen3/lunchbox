import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import cors from "cors";

// Routes
import authRouter from "./routes/auth.js";
import menuRouter from "./routes/menu.js";

// Payment
import Stripe from "stripe";

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

app.post("/addItem", async (req, res) => {});

app.post("/removeItem", async (req, res) => {});

app.post("/submitOrder", async (req, res) => {});

app.post("");

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
