import express from 'express';
import connectToDb from '../db';
import { HandleApiResponse } from '../utils/api';

const routerNhomMon = express.Router();

routerNhomMon.get(
    '/',
    async (req, res) => {
        try {
            const pool = await connectToDb();
            const result = await pool.request().query('SELECT * FROM NhomMon');
            await HandleApiResponse(res, result);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    });

routerNhomMon.post(
    '/',
    async (req, res) => {
        try {
            const pool = await connectToDb();
            console.log(req)
            console.log(req.body)
            const { TenNhomMon } = req.body;
            const result = await pool.request()
                .input('TenNhomMon', TenNhomMon)
                .query('INSERT INTO NhomMon (TenNhomMon) VALUES (@TenNhomMon)');
            await HandleApiResponse(res, result);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    });

export default routerNhomMon;