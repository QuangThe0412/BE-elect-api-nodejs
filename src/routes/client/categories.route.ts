import express, { Request, Response } from 'express';
import { LoaiMon } from '../../models/init-models';

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
export default routerCategories;