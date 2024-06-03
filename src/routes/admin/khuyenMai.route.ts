import express, { Request, Response } from 'express';
import { Khuyenmai } from '../../models/init-models';

const routerKhuyenMai = express.Router();

//get all
routerKhuyenMai.get('/', async (req: Request, res: Response) => {
    try {
        const khuyenMai = await Khuyenmai.findAll();
        res.json(khuyenMai);
    } catch (error) {
        res.json({ message: error });
    }
});

//get details
routerKhuyenMai.get('/:id', async (req: Request, res: Response) => {
    try {
        const khuyenMai = await Khuyenmai.findByPk(req.params.id);
        res.json(khuyenMai);
    } catch (error) {
        res.json({ message: error });
    }
});

//create
routerKhuyenMai.post('/', async (req: Request, res: Response) => {
    try {
        const khuyenMai = await Khuyenmai.create(req.body);
        res.json(khuyenMai);
    } catch (error) {
        res.json({ message: error });
    }
});

//update
routerKhuyenMai.put('/:id', async (req: Request, res: Response) => {
    try {
        const khuyenMai = await Khuyenmai.findByPk(req.params.id);
        if (khuyenMai) {
            khuyenMai.update(req.body);
            res.json(khuyenMai);
        } else {
            res.json({ message: 'Khong tim thay khuyen mai' });
        }
    } catch (error) {
        res.json({ message: error });
    }
});

//delete
routerKhuyenMai.delete('/:id', async (req: Request, res: Response) => {
    try {
        const khuyenMai = await Khuyenmai.findByPk(req.params.id);
        if (khuyenMai) {
            khuyenMai.destroy();
            res.json({ message: 'Xoa thanh cong' });
        } else {
            res.json({ message: 'Khong tim thay khuyen mai' });
        }
    } catch (error) {
        res.json({ message: error });
    }
});

export default routerKhuyenMai;

