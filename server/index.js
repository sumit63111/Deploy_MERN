const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RegisterModel = require('./models/Register');

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "https://deploy-mern-frontend-eight.vercel.app", // Frontend origin
    methods: ["POST", "GET"], // Allowed methods
    credentials: true, // Allow credentials like cookies or HTTP auth
  })
);

app.use(express.json()); // Parse incoming JSON payloads

// MongoDB URI directly included
const mongodbURI = 'mongodb+srv://yousaf:test123@cluster0.g4i5dey.mongodb.net/test?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(
  mongodbURI, // Use the direct URI for MongoDB connection
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Default route
app.get("/", (req, res) => {
  res.json("Hello from the backend!");
});

// Registration route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if email exists in the database
    const user = await RegisterModel.findOne({ email: email });

    if (user) {
      return res.status(400).json({ message: "Already have an account" });
    }

    // Create a new user
    const newUser = new RegisterModel({ name, email, password });
    const result = await newUser.save();
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error processing registration" });
  }
});

// Start server
app.listen(3001, () => {
  console.log("Server is Running on port 3001");
});
