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
            res.send({
                data: result,
                code: 'GET_ALL_LOAIMON_SUCCESS',
                mess: 'Get all loai mon success',
            });
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
            loaiMon.IDLoaiMon = null;

            const nhomMon = await NhomMon.findOne({
                where: {
                    IDNhomMon: loaiMon.IDNhomMon,
                },
            });

            //check nhomMon
            if (!nhomMon) {
                return res.status(404).send({
                    code: 'NHOMMON_NOT_FOUND',
                    mess: 'Không tim thấy nhóm món',
                });
            }

            //check exist TenLoai
            const getLoaiMonByName = await LoaiMon.findOne({
                where: {
                    TenLoai: loaiMon.TenLoai,
                },
            });

            if (getLoaiMonByName) {
                return res.status(400).send({
                    code: 'NAME_LOAIMON_EXISTED',
                    mess: 'Tên loại món đã tồn tại',
                });
            }

            const result = await LoaiMon.create(loaiMon);
            res.send({
                data: result,
                code: 'CREATE_LOAIMON_SUCCESS',
                mess: 'Create loai mon success',
            });
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
            const result = await LoaiMon.findOne({
                where: {
                    IDLoaiMon: id,
                },
            });
            res.send({
                data: result,
                code: 'GET_LOAIMON_SUCCESS',
                mess: 'Get loai mon success',
            });
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

            if (!id) return res.status(400).send({
                code: 'ID_REQUIRED',
                mess: 'Không tìm thấy ID',
            });

            const loaiMon = await LoaiMon.findOne({
                where: {
                    IDLoaiMon: id,
                },
            });

            if (!loaiMon) return res.status(404).send({
                code: 'LOAIMON_NOT_FOUND',
                mess: 'Không tìm thấy loại món',
            });

            //if TenLoai is changed
            if (loaiMon.TenLoai !== TenLoai) {
                const loaiMonExist = await LoaiMon.findOne({
                    where: {
                        TenLoai,
                    },
                });

                if (loaiMonExist) return res.status(400).send({
                    code: 'NAME_LOAIMON_EXISTED',
                    mess: 'Tên loại món đã tồn tại',
                });
            }

            const nhomMon = await NhomMon.findOne({
                where: {
                    IDNhomMon,
                },
            });

            if (!nhomMon) return res.status(404).send({
                code: 'NHOMMON_NOT_FOUND',
                mess: 'Không tìm thấy nhóm món',
            });

            const response = await LoaiMon.update({ TenLoai, IDNhomMon }, { where: { IDLoaiMon: id } });
            res.send({
                data: response,
                code: 'UPDATE_LOAIMON_SUCCESS',
                mess: 'Update loai mon success',
            });
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

            if (!id) return res.status(400).send({
                code: 'ID_REQUIRED',
                mess: 'Không tìm thấy ID',
            });

            const loaiMon = await LoaiMon.findOne({
                where: {
                    IDLoaiMon: id,
                },
            });

            if (!loaiMon) return res.status(404).send({
                code: 'LOAIMON_NOT_FOUND',
                mess: 'Không tìm thấy loại món',
            });

            const getMonByIdLoaiMon = await Mon.findOne({
                where: {
                    IDLoaiMon: id,
                },
            });

            if (!loaiMon.Deleted && getMonByIdLoaiMon) return res.status(400).send({
                code: 'HAD_MON_IN_LOAIMON',
                mess: 'Có món thuộc loại món này',
            });

            // const response = await LoaiMon.destroy({
            //     where: {
            //         IDLoaiMon: id,
            //     },
            // });
            loaiMon.Deleted = !loaiMon.Deleted;

            const response = await LoaiMon.update(loaiMon, { where: { IDLoaiMon: id } });
            res.send({
                data: response,
                code: 'TOGGLE_LOAIMON_SUCCESS',
                mess: 'Bật/Tắt loại món thành công',
            });
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

            if (!loaiMon) return res.status(404).send({
                code: 'LOAIMON_NOT_FOUND',
                mess: 'Không tìm thấy loại món',
            });

            const mons = await Mon.findAll({
                where: {
                    IDLoaiMon: loaiMonId,
                },
            });

            res.send({
                data: mons,
                code: 'SEARCH_MON_BY_LOAIMON_SUCCESS',
                mess: 'Tìm kiếm món theo loại món thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });
export default routerLoaiMon;