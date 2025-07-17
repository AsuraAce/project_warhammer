import path from 'path';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import mongoose from 'mongoose';

// Load environment variables
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.resolve(__dirname, envFile) });

// Route imports
import authRoutes from './routes/authRoutes';
import characterRoutes from './routes/characterRoutes';
import dataRoutes from './routes/dataRoutes';
import gameRoutes from './routes/gameRoutes';
import { initializeWebSocket } from './services/webSocketService';

const app: Express = express();

// Middleware
// Middleware
const whitelist = ['http://localhost:5173', 'http://localhost:5174'];
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/game', gameRoutes);

// Health check route
app.get('/', (req, res) => {
  res.status(200).send('Backend is alive!');
});

// Serve React app for all other GET requests
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI must be defined in .env file');
  process.exit(1);
}

const startServer = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully.');

    const server = http.createServer(app);
    const wss = new WebSocketServer({ server });

    initializeWebSocket(wss);

    server.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server is running on http://127.0.0.1:${PORT}`);
      console.log(`WebSocket server is running on ws://127.0.0.1:${PORT}`);
    }).on('error', (err: any) => {
      console.error('SERVER STARTUP ERROR:', err);
      process.exit(1);
    });

  } catch (dbError) {
    console.error('DATABASE CONNECTION FAILED:', dbError);
    process.exit(1);
  }
};

startServer();
