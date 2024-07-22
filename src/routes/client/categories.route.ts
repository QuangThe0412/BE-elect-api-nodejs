import express, { Request, Response } from 'express';
import { LoaiMon } from '../../models/init-models';
import { removeAccentAndSpecialChars } from '../../utils/index';

const routerCategories = express.Router();

//get all
routerCategories.get(
    '/',
    async (req: Request, res: Response) => {
        try {
            const result: LoaiMon[] = await LoaiMon.findAll({
                order: [['TenLoai', 'ASC']],
                where: { Deleted: false },
                attributes: ['IDLoaiMon', 'TenLoai', 'IDNhomMon'],
            });

            res.status(200).send({
                data: result,
                code: 'GET_ALL_LOAIMON_SUCCESS',
                mess: 'Nhận danh sách loại món thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });
//get details
routerCategories.get(
    '/:nameCategory',
    async (req: Request, res: Response) => {
        try {
            const nameCategory = req.params.nameCategory;
            const loaiMon = await LoaiMon.findAll({
                where: {
                    Deleted: false
                },
                attributes: ['IDLoaiMon', 'TenLoai']
            })

            const result: LoaiMon = loaiMon.find(m => removeAccentAndSpecialChars(m.TenLoai) === nameCategory);
            
            res.status(200).send({
                data: result,
                code: 'GET_LOAIMON_SUCCESS',
                mess: 'Nhận loại món thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });
export default routerCategories;