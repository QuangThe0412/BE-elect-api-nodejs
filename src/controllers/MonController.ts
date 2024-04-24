import { Request, Response } from 'express';
import { getMons } from '../models/Mon';

export const getAllMons = async (req: Request, res: Response) => {
  try {
    const mons = await getMons();
    res.json(mons);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};