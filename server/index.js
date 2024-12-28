const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RegisterModel = require('./models/Register');

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: ['https://deploy-mern-frontend-eight.vercel.app'],
    methods: ['POST', 'GET'],
    credentials: true,
  })
);

app.use(express.json());

// Connect to MongoDB
// Make sure your password is properly encoded if it contains '@'
const mongodbURI = process.env.MONGO_URI || 'mongodb://your-properly-encoded-URI';
mongoose
  .connect(mongodbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Default route
app.get('/', (req, res) => {
  res.json('Hello from the backend!');
});

// Registration route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if email exists
    const user = await RegisterModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Already have an account' });
    }

    // Create new user
    const newUser = new RegisterModel({ name, email, password });
    const result = await newUser.save();
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error processing registration' });
  }
});

// Only listen locally for development
if (process.env.NODE_ENV !== 'production') {
  app.listen(3001, () => {
    console.log('Server is running on port 3001');
  });
}

// Export the app for Vercel
module.exports = app;
