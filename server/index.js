// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RegisterModel = require('./models/Register');

const app = express();

// --- 1. CORS Middleware ---
app.use(
  cors({
    origin: ["https://deploy-mern-frontend-eight.vercel.app"], // Your frontend URL
    methods: ["POST", "GET"],
    credentials: true,
  })
);

// --- 2. Body Parsing ---
app.use(express.json());

// --- 3. MongoDB URI with special characters URL-encoded ---
// Example: If your password is `Sumit@1260`, the `@` becomes `%40`
const mongodbURI = "mongodb://sumit6311:Sumit%401260@cluster0.g4i5dey.mongodb.net/test?retryWrites=true&w=majority";

// --- 4. Connect to MongoDB ---
mongoose.connect(mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

// --- 5. Routes ---
app.get("/", (req, res) => {
  res.json("Hello from the backend!");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if email already exists
    const existingUser = await RegisterModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new RegisterModel({ name, email, password });
    const result = await newUser.save();
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error processing registration" });
  }
});

// --- 6. Export for Vercel (no `app.listen` here) ---
module.exports = app;
