"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userModel_js_1 = __importDefault(require("../models/userModel.js"));
const characterModel_js_1 = __importDefault(require("../models/characterModel.js"));
const router = (0, express_1.Router)();
// @route   POST /api/characters/start-new
// @desc    Create a new dummy user and character to start a game
// @access  Public (for now)
router.post('/start-new', async (req, res) => {
    try {
        // Create a dummy user
        const newUser = new userModel_js_1.default({
            username: `Player_${Date.now()}`,
            password: 'password' // In a real app, this would be hashed
        });
        await newUser.save();
        // Create a dummy character
        const newCharacter = new characterModel_js_1.default({
            name: 'Grommir Stonehand',
            career: 'Dwarf Ironbreaker',
            userId: newUser._id
        });
        await newCharacter.save();
        res.json(newCharacter);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
exports.default = router;
