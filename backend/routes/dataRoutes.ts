import express from 'express';
import {
  getCreatures,
  getCreatureById,
  getCareers,
  getCareerByTitle,
} from '../controllers/dataController';

const router = express.Router();

// Bestiary routes
router.route('/bestiary').get(getCreatures);
router.route('/bestiary/:id').get(getCreatureById);

// Career routes
router.route('/careers').get(getCareers);
router.route('/careers/:title').get(getCareerByTitle);

export default router;
