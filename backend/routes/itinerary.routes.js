import { Router } from 'express';
import { getItineraries, getItineraryById, createItinerary, updateItinerary, deleteItinerary } from '../controllers/itinerary.controller.js';
import auth from '../middleware/auth.js'; // <-- aquí

const router = Router();

router.get('/', getItineraries);
router.get('/:id', getItineraryById);
router.post('/', auth, createItinerary);
router.put('/:id', auth, updateItinerary);
router.delete('/:id', auth, deleteItinerary);

export default router;
