const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  character: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', required: true },
  log: [
    {
      type: { type: String, enum: ['narrative', 'roll', 'system', 'player'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  gameState: {
    currentLocation: { type: String, default: 'A quiet tavern in Ubersreik' },
    // Other state variables can be added here
  },
  // Link to the user account
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
