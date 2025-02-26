import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import env from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";

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
const saltRounds = 10;
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

const secretKey = process.env.SESSION_KEY;

function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    permission_level: user.permission_level,
  };
  const options = { expiresIn: "2h" };
  console.log("generated");
  return jwt.sign(payload, secretKey, options);
}

function verifyToken(req, res, next) {
  const token = req.headers["access-token"];
  if (!token) {
    console.log("no token provided");
    return res.status(403).send("No token provided");
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(500).send("Failed to authenticate token");
    }
    req.user = decoded; // Save the decoded token to request object
    next();
  });
}

function checkPermissionLevel(minRequiredLevel) {
  return (req, res, next) => {
    const userPermissionLevel = req.user.permission_level;
    if (userPermissionLevel >= minRequiredLevel) {
      next();
    } else {
      console.log("Level isn't sufficient");
      res
        .status(403)
        .json({ message: "You do not have the required permission level" });
    }
  };
}
// Function to compare the password
async function comparePassword(plainPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch;
}

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM engineers WHERE username = $1",
      [username]
    );
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;

      const valid = await comparePassword(password, storedHashedPassword);
      if (valid) {
        const token = generateToken(user);
        console.log("Valid ", token);
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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
