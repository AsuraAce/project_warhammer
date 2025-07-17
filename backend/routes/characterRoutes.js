const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Character = require('../models/characterModel');

// @route   POST /api/characters/start-new
// @desc    Create a new dummy user and character to start a game
// @access  Public (for now)
router.post('/start-new', async (req, res) => {
  try {
    // Create a dummy user
    const newUser = new User({
      username: `Player_${Date.now()}`,
      password: 'password' // In a real app, this would be hashed
    });
    await newUser.save();

    // Create a dummy character
    const newCharacter = new Character({
      name: 'Grommir Stonehand',
      career: 'Dwarf Ironbreaker',
      userId: newUser._id
    });
    await newCharacter.save();

    res.json(newCharacter);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
