import express from 'express';
import connectToDb from '../db';
import { HandleApiResponse } from '../utils/api';
const routerMon = express.Router();

routerMon.get(
    '/',
    async (req, res) => {
        try {
            const pool = await connectToDb();
            // const result = await pool.request().query('SELECT * FROM Mon');
            const result = await pool.request().query('SELECT top 2 *  FROM Mon');
            await HandleApiResponse(res, result);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    });

export default routerMon;