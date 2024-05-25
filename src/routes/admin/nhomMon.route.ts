import express, { Request, Response } from 'express';
import { NhomMon } from '../../models/init-models';

const routerNhomMon = express.Router();

//get all
routerNhomMon.get(
    '/',
    async (req: Request, res: Response) => {
        try {
            let result: NhomMon[] = await NhomMon.findAll({
                order: [['IDNhomMon', 'DESC']],
            });
            res.send({
                data: result,
                code: 'GET_ALL_NHOMMON_SUCCESS',
                mess: 'Get all nhom mon success',
            });
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
            const { TenNhom } = req.body;
            const result = await NhomMon.create({ TenNhom });
            res.send({
                data: result,
                code: 'CREATE_NHOMMON_SUCCESS',
                mess: 'Create nhom mon success',
            });
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
            const result = await NhomMon.findOne({
                where: {
                    IDNhomMon: id,
                },
            })
            res.send({
                data: result,
                code: 'GET_NHOMMON_SUCCESS',
                mess: 'Get nhom mon success',
            });
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
            res.send({
                data: response,
                code: 'UPDATE_NHOMMON_SUCCESS',
                mess: 'Update nhom mon success',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });
export default routerNhomMon;