import express from 'express';
import { Mon } from '../models/init-models';

const routerMon = express.Router();

routerMon.get(
    '/',
    async (req, res) => {
        try {
            const result = await Mon.findAll();
            res.send(result);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    });

export default routerMon;