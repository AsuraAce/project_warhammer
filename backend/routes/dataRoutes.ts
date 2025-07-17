import express from 'express';
import {
  getCreatures,
  getCreatureById,
  getCareers,
  getCareerByTitle,
  getSpells,
  getSpellById,
  getTalents,
  getTalentById,
  getSkills,
  getSkillById,
  getTrappings,
  getTrappingById,
  getReferences,
  getReferenceById,
  getReferencesBySource,
} from '../controllers/dataController';

const router = express.Router();

// Bestiary routes
router.route('/bestiary').get(getCreatures);
router.route('/bestiary/:id').get(getCreatureById);

// Career routes
router.route('/careers').get(getCareers);
router.route('/careers/:title').get(getCareerByTitle);

// Spell routes
router.route('/spells').get(getSpells);
router.route('/spells/:id').get(getSpellById);

// Talent routes
router.route('/talents').get(getTalents);
router.route('/talents/:id').get(getTalentById);

// Skill routes
router.route('/skills').get(getSkills);
router.route('/skills/:id').get(getSkillById);

// Trapping routes
router.route('/trappings').get(getTrappings);
router.route('/trappings/:id').get(getTrappingById);

// Reference Routes
router.route('/references').get(getReferences);
router.route('/references/source/:source').get(getReferencesBySource);
router.route('/references/:id').get(getReferenceById);

export default router;
