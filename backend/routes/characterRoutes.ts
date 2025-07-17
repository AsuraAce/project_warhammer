import { Router, Request, Response } from 'express';
import User from '../models/userModel';
import Character from '../models/characterModel';

const router = Router();

// @route   POST /api/characters/start-new
// @desc    Create a new dummy user and character to start a game
// @access  Public (for now)
router.post('/start-new', async (req: Request, res: Response) => {
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

  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
