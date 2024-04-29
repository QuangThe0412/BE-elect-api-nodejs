import express, { Request, Response } from 'express';
import { NhomMon } from '../models/init-models';

const routerNhomMon = express.Router();

//get all
routerNhomMon.get(
    '/',
    async (req: Request, res: Response) => {
        try {
            let result: NhomMon[] = await NhomMon.findAll();
            res.send(result);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//create
routerNhomMon.post(
    '/',
    async (req: Request, res: Response) => {
        try {
            console.log(req.body)
            const { TenNhom } = req.body;
            res.send(await NhomMon.create({ TenNhom }));
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//get details
routerNhomMon.get(
    '/:id',
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            res.send(await NhomMon.findOne({
                where: {
                    IDNhomMon: id,
                },
            }));
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//update
routerNhomMon.put(
    '/:id',
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { TenNhom } = req.body;
            console.log({TenNhom})
            const nhomMon: NhomMon = await NhomMon.findOne({
                where: {
                    IDNhomMon: id,
                },
            });
            
            if (!nhomMon) {
                return res.status(404).send('NhomMon not found');
            }
            nhomMon.TenNhom = TenNhom;
            
            const response = await NhomMon.update({ ...nhomMon }, { where: { IDNhomMon: id } });
            res.send(response);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });
export default routerNhomMon;