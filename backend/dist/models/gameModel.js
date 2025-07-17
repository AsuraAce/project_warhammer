"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const gameSchema = new mongoose_1.Schema({
    character: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Character', required: true },
    log: [
        {
            type: { type: String, enum: ['narrative', 'roll', 'system', 'player'], required: true },
            content: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
        },
    ],
    gameState: {
        currentLocation: { type: String, default: 'A quiet tavern in Ubersreik' },
    },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
const Game = (0, mongoose_1.model)('Game', gameSchema);
exports.default = Game;
