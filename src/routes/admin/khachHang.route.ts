import express, { Request, Response } from 'express';
import { KhachHang } from '../../models/init-models';
import { MergeWithOldData } from '../../utils';

const routerKhachHang = express.Router();

//get all
routerKhachHang.get('/', async (req: Request, res: Response) => {
    try {
        let result: KhachHang[] = await KhachHang.findAll({
            order: [['IDKhachHang', 'DESC']],
        });
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//create
routerKhachHang.post('/', async (req: Request, res: Response) => {
    try {
        const khachHang = req.body as KhachHang;
        khachHang.NgayTao = new Date();
        res.send(await KhachHang.create(khachHang));
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//get details
routerKhachHang.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        res.send(await KhachHang.findOne({
            where: {
                IDKhachHang: id,
            },
        }));
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//update
routerKhachHang.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let khachHang = req.body as KhachHang;

        if (!id) return res.status(400).send('id is required');

        const oldKhachHang = await KhachHang.findOne({ where: { IDKhachHang: id } });
        if (!oldKhachHang) return res.status(404).send('KhachHang not found');

        khachHang = MergeWithOldData(oldKhachHang, khachHang);
        khachHang.NgaySua = new Date();

        const response = await KhachHang.update(khachHang, { where: { IDKhachHang: id } });
        res.send(response);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//delete
routerKhachHang.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).send('id is required');

        const response = await KhachHang.update({ Deleted: true, NgaySua: new Date() }, { where: { IDKhachHang: id } });
        res.send(response);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

export default routerKhachHang;