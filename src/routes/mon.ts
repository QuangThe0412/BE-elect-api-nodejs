import express from 'express';
import { getAllMons } from '../controllers/MonController';

const router = express.Router();

router.get('/', getAllMons);

export default router;