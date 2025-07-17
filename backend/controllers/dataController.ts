import { Request, Response } from 'express';
import Creature from '../models/creatureModel';
import Career from '../models/careerModel';
import Spell from '../models/spellModel';
import Talent from '../models/talentModel';
import Skill from '../models/skillModel';
import Trapping from '../models/trappingModel';
import Reference from '../models/referenceModel';

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

// @desc    Fetch all spells
// @route   GET /api/data/spells
// @access  Public
export const getSpells = async (req: Request, res: Response) => {
  try {
    const spells = await Spell.find({});
    res.json(spells);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch a single spell by ID
// @route   GET /api/data/spells/:id
// @access  Public
export const getSpellById = async (req: Request, res: Response) => {
  try {
    const spell = await Spell.findOne({ id: req.params.id });
    if (spell) {
      res.json(spell);
    } else {
      res.status(404).json({ message: 'Spell not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch all talents
// @route   GET /api/data/talents
// @access  Public
export const getTalents = async (req: Request, res: Response) => {
  try {
    const talents = await Talent.find({});
    res.json(talents);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch a single talent by ID
// @route   GET /api/data/talents/:id
// @access  Public
export const getTalentById = async (req: Request, res: Response) => {
  try {
    const talent = await Talent.findOne({ id: req.params.id });
    if (talent) {
      res.json(talent);
    } else {
      res.status(404).json({ message: 'Talent not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch all skills
// @route   GET /api/data/skills
// @access  Public
export const getSkills = async (req: Request, res: Response) => {
  try {
    const skills = await Skill.find({});
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch a single skill by ID
// @route   GET /api/data/skills/:id
// @access  Public
export const getSkillById = async (req: Request, res: Response) => {
  try {
    const skill = await Skill.findOne({ id: req.params.id });
    if (skill) {
      res.json(skill);
    } else {
      res.status(404).json({ message: 'Skill not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch all trappings
// @route   GET /api/data/trappings
// @access  Public
export const getTrappings = async (req: Request, res: Response) => {
  try {
    const trappings = await Trapping.find({});
    res.json(trappings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch a single trapping by ID
// @route   GET /api/data/trappings/:id
// @access  Public
export const getTrappingById = async (req: Request, res: Response) => {
  try {
    const trapping = await Trapping.findOne({ id: req.params.id });
    if (trapping) {
      res.json(trapping);
    } else {
      res.status(404).json({ message: 'Trapping not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch all references
// @route   GET /api/data/references
// @access  Public
export const getReferences = async (req: Request, res: Response) => {
  try {
    const references = await Reference.find({});
    res.json(references);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch a single reference by ID
// @route   GET /api/data/references/:id
// @access  Public
export const getReferenceById = async (req: Request, res: Response) => {
  try {
    const reference = await Reference.findOne({ id: req.params.id });
    if (reference) {
      res.json(reference);
    } else {
      res.status(404).json({ message: 'Reference not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch all references by source
// @route   GET /api/data/references/source/:source
// @access  Public
export const getReferencesBySource = async (req: Request, res: Response) => {
  try {
    const references = await Reference.find({ source: req.params.source });
    if (references && references.length > 0) {
      res.json(references);
    } else {
      res.status(404).json({ message: 'References not found for this source' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
