const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RegisterModel = require('./models/Register');

const app = express();

// CORS Configuration
app.use(
    cors({
        origin: ["https://deploy-mern-frontend-eight.vercel.app"], // Frontend origin
        methods: ["POST", "GET"], // Allowed methods
        credentials: true, // Allow credentials like cookies or HTTP auth
    })
);

app.use(express.json()); // Parse incoming JSON payloads

// Connect to MongoDB
mongoose.connect(
    'mongodb+srv://yousaf:test123@cluster0.g4i5dey.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Default route
app.get("/", (req, res) => {
    res.json("Hello");
});

// Registration route
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    // Check if email exists in the database
    RegisterModel.findOne({ email: email })
        .then((user) => {
            if (user) {
                res.json("Already have an account");
            } else {
                // Create a new user
                RegisterModel.create({ name, email, password })
                    .then((result) => res.json(result))
                    .catch((err) => {
                        console.error(err);
                        res.status(500).json({ error: "Error creating user" });
                    });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: "Error finding user" });
        });
});

// Start server
app.listen(3001, () => {
    console.log("Server is Running on port 3001");
});
