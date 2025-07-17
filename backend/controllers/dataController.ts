import { Request, Response } from 'express';
import Creature from '../models/creatureModel';
import Career from '../models/careerModel';

// @desc    Fetch all creatures
// @route   GET /api/data/bestiary
// @access  Public
export const getCreatures = async (req: Request, res: Response) => {
  try {
    const creatures = await Creature.find({});
    res.json(creatures);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch a single creature by ID
// @route   GET /api/data/bestiary/:id
// @access  Public
export const getCreatureById = async (req: Request, res: Response) => {
  try {
    const creature = await Creature.findOne({ id: req.params.id });
    if (creature) {
      res.json(creature);
    } else {
      res.status(404).json({ message: 'Creature not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch all careers
// @route   GET /api/data/careers
// @access  Public
export const getCareers = async (req: Request, res: Response) => {
  try {
    const careers = await Career.find({});
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch a single career by title
// @route   GET /api/data/careers/:title
// @access  Public
export const getCareerByTitle = async (req: Request, res: Response) => {
  try {
    // Titles can have spaces, so we need to decode the URI component
    const title = decodeURIComponent(req.params.title);
    const career = await Career.findOne({ title: title });
    if (career) {
      res.json(career);
    } else {
      res.status(404).json({ message: 'Career not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
