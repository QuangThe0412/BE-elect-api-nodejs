import express, { Request, Response } from 'express';
import { ChiTietKM } from '../../models/init-models';

const routerChiTietKM = express.Router();

//get all
routerChiTietKM.get('/', async (req: Request, res: Response) => {
    try {
        const chiTietKM = await ChiTietKM.findAll();
        res.json(chiTietKM);
    } catch (error) {
        res.json({ message: error });
    }
});

//get details
routerChiTietKM.get('/:id', async (req: Request, res: Response) => {
    try {
        const chiTietKM = await ChiTietKM.findByPk(req.params.id);
        res.json(chiTietKM);
    } catch (error) {
        res.json({ message: error });
    }
});

//create
routerChiTietKM.post('/', async (req: Request, res: Response) => {
    try {
        const chiTietKM = await ChiTietKM.create(req.body);
        res.json(chiTietKM);
    } catch (error) {
        res.json({ message: error });
    }
});

//update
routerChiTietKM.put('/:id', async (req: Request, res: Response) => {
    try {
        const chiTietKM = await ChiTietKM.findByPk(req.params.id);
        if (chiTietKM) {
            chiTietKM.update(req.body);
            res.json(chiTietKM);
        } else {
            res.json({ message: 'Khong tim thay chi tiet khuyen mai' });
        }
    } catch (error) {
        res.json({ message: error });
    }
});

//delete
routerChiTietKM.delete('/:id', async (req: Request, res: Response) => {
    try {
        const chiTietKM = await ChiTietKM.findByPk(req.params.id);
        if (chiTietKM) {
            chiTietKM.destroy();
            res.json({ message: 'Xoa thanh cong' });
        } else {
            res.json({ message: 'Khong tim thay chi tiet khuyen mai' });
        }
    } catch (error) {
        res.json({ message: error });
    }
});
