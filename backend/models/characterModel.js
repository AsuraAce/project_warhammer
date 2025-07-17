const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  career: { type: String, required: true },
  stats: {
    // Example stats from WFRP 4e
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
  // Link to the user account
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Character = mongoose.model('Character', characterSchema);

module.exports = Character;
