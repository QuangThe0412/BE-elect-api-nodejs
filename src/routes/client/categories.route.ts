import express, { Request, Response } from 'express';
import { LoaiMon, Mon } from '../../models/init-models';

const routerCategories = express.Router();

//get all
routerCategories.get(
    '/',
    async (req: Request, res: Response) => {
        try {
            const result: LoaiMon[] = await LoaiMon.findAll({
                order: [['TenLoai', 'ASC']],
                where: { Deleted: false },
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
    '/:id',
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const result = await LoaiMon.findOne({
                where: {
                    IDLoaiMon: id,
                    Deleted: false
                },
            });
            res.status(200).send({
                data: result,
                code: 'GET_LOAIMON_SUCCESS',
                mess: 'Nhận thông tin loại món thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//search mon by loaiMon
routerCategories.get(
    '/searchProduct/:categoryId',
    async (req, res) => {
        try {
            const { categoryId } = req.params;
            const loaiMon = await LoaiMon.findOne({
                where: {
                    IDLoaiMon: categoryId,
                    Deleted: false,
                },
            });

            if (!loaiMon) return res.status(404).send({
                code: 'LOAIMON_NOT_FOUND',
                mess: 'Không tìm thấy loại món',
            });

            const mons = await Mon.findAll({
                where: {
                    IDLoaiMon: categoryId,
                },
            });

            res.status(200).send({
                data: mons,
                code: 'SEARCH_MON_BY_LOAIMON_SUCCESS',
                mess: 'Tìm kiếm món theo loại món thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });
export default routerCategories;