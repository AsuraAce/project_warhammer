"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
// Load environment variables
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, envFile) });
// Route imports
const authRoutes_js_1 = __importDefault(require("./routes/authRoutes.js"));
const characterRoutes_js_1 = __importDefault(require("./routes/characterRoutes.js"));
const gameRoutes_js_1 = __importDefault(require("./routes/gameRoutes.js"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
// API Routes
app.use('/api/auth', authRoutes_js_1.default);
app.use('/api/characters', characterRoutes_js_1.default);
app.use('/api/game', gameRoutes_js_1.default);
// Serve React app for all other GET requests
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'public', 'index.html'));
});
const startServer = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        if (!MONGO_URI) {
            throw new Error('MONGO_URI must be defined in .env file');
        }
        console.log('Connecting to MongoDB...');
        await mongoose_1.default.connect(MONGO_URI);
        console.log('MongoDB connected successfully.');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
    catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
};
startServer();
