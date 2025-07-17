"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const characterSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    career: { type: String, required: true },
    stats: {
        weaponSkill: { type: Number, default: 30 },
        ballisticSkill: { type: Number, default: 30 },
        strength: { type: Number, default: 30 },
        toughness: { type: Number, default: 30 },
        initiative: { type: Number, default: 30 },
        agility: { type: Number, default: 30 },
        dexterity: { type: Number, default: 30 },
        intelligence: { type: Number, default: 30 },
        willpower: { type: Number, default: 30 },
        fellowship: { type: Number, default: 30 },
    },
    skills: [{ name: String, value: Number }],
    talents: [{ name: String, description: String }],
    inventory: [String],
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
const Character = (0, mongoose_1.model)('Character', characterSchema);
exports.default = Character;
