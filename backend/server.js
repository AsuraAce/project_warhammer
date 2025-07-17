const path = require('path');
const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.resolve(__dirname, envFile) });

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/characters', require('./routes/characterRoutes'));
app.use('/api/game', require('./routes/gameRoutes'));

// All other GET requests should serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error('MONGO_URI must be defined in .env file');
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // Give up after 5 seconds
    });
    console.log('MongoDB connected successfully.');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('Failed to connect to MongoDB. Please ensure MongoDB is running.');
    console.error(err.message);
    process.exit(1);
  }
};

startServer();

