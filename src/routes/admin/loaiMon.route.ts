import express, { Request, Response } from 'express';
import { LoaiMon, Mon, NhomMon } from '../../models/init-models';

const routerLoaiMon = express.Router();

//get all
routerLoaiMon.get(
    '/',
    async (req: Request, res: Response) => {
        try {
            let result: LoaiMon[] = await LoaiMon.findAll({
                order: [['IDLoaiMon', 'DESC']],
            });
            res.send(result);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//create
routerLoaiMon.post(
    '/',
    async (req: Request, res: Response) => {
        try {
            const loaiMon = req.body as LoaiMon;

            const nhomMon = await NhomMon.findOne({
                where: {
                    IDNhomMon: loaiMon.IDNhomMon,
                },
            });

            //check nhomMon
            if (!nhomMon) {
                return res.status(404).send('NhomMon not found');
            }

            //check exist TenLoai
            const loaiMonExist = await LoaiMon.findOne({
                where: {
                    TenLoai: loaiMon.TenLoai,
                },
            });

            if (loaiMonExist) {
                return res.status(400).send('TenLoai already exist');
            }

            res.send(await LoaiMon.create(loaiMon));
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//get details
routerLoaiMon.get(
    '/:id',
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            res.send(await LoaiMon.findOne({
                where: {
                    IDLoaiMon: id,
                },
            }));
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//update
routerLoaiMon.put(
    '/:id',
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { TenLoai, IDNhomMon } = req.body as LoaiMon;

            if (!id) return res.status(400).send('id is required');

            const loaiMon = await LoaiMon.findOne({
                where: {
                    IDLoaiMon: id,
                },
            });

            if (!loaiMon) return res.status(404).send('LoaiMon not found');

            //if TenLoai is changed
            if (loaiMon.TenLoai !== TenLoai) {
                const loaiMonExist = await LoaiMon.findOne({
                    where: {
                        TenLoai,
                    },
                });

                if (loaiMonExist) return res.status(400).send('TenLoai already exist');
            }

            const nhomMon = await NhomMon.findOne({
                where: {
                    IDNhomMon,
                },
            });

            if (!nhomMon) return res.status(404).send('NhomMon not found');

            const response = await LoaiMon.update({ TenLoai, IDNhomMon }, { where: { IDLoaiMon: id } });
            res.send(response);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//delete
routerLoaiMon.delete(
    '/:id',
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) return res.status(400).send('id is required');

            const loaiMon = await LoaiMon.findOne({
                where: {
                    IDLoaiMon: id,
                },
            });

            if (!loaiMon) return res.status(404).send('LoaiMon not found');

            const mon = await Mon.findOne({
                where: {
                    IDLoaiMon: id,
                },
            });

            if (mon) return res.status(400).send('LoaiMon is in use');

            // const response = await LoaiMon.destroy({
            //     where: {
            //         IDLoaiMon: id,
            //     },
            // });

            const response = await LoaiMon.update({ Deleted: true }, { where: { IDLoaiMon: id } });
            res.send(response);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//search mon by loaiMon
routerLoaiMon.get(
    '/searchMon/:loaiMonId',
    async (req, res) => {
        try {
            const { loaiMonId } = req.params;
            const loaiMon = await LoaiMon.findOne({
                where: {
                    IDLoaiMon: loaiMonId,
                },
            });

            if (!loaiMon) return res.status(404).send('LoaiMon not found');

            const mons = await Mon.findAll({
                where: {
                    IDLoaiMon: loaiMonId,
                },
            });

            res.send(mons);
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });
export default routerLoaiMon;