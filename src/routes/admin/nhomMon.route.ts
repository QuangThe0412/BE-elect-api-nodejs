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
            res.status(200).send({
                data: result,
                code: 'GET_ALL_NHOMMON_SUCCESS',
                mess: 'Nhận danh sách nhóm món thành công',
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
            const nhomMon = req.body as NhomMon;
            nhomMon.IDNhomMon = null;

            //check exist TenNhom
            const getNhomByName = await NhomMon.findOne({
                where: {
                    TenNhom: nhomMon.TenNhom,
                },
            });

            if(getNhomByName){
                return res.status(400).send({
                    code: 'NAME_NHOMMON_EXISTED',
                    mess: 'Tên nhóm món đã tồn tại',
                });
            }

            const result = await NhomMon.create(nhomMon);
            res.status(201).send({
                data: result,
                code: 'CREATE_NHOMMON_SUCCESS',
                mess: 'Tạo nhóm món thành công',
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
            res.status(200).send({
                data: result,
                code: 'GET_NHOMMON_SUCCESS',
                mess: 'Nhận thông tin nhóm món thành công',
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
            const nhomMon: NhomMon = await NhomMon.findOne({
                where: {
                    IDNhomMon: id,
                },
            });

            if (!nhomMon) {
                return res.status(404).send({
                    code: 'NHOMMON_NOT_FOUND',
                    mess: 'NhomMon not found',
                });
            }

            //check case update TenNhom
            const { TenNhom } = req.body;
            if (TenNhom !== nhomMon.TenNhom) {
                const nhomMonByName = await NhomMon.findOne({
                    where: {
                        TenNhom,
                    },
                });
                if (nhomMonByName) {
                    return res.status(400).send({
                        code: 'NAME_NHOMMON_EXISTED',
                        mess: 'Tên nhóm món đã tồn tại',
                    });
                }
            }
            const response = await NhomMon.update({ ...nhomMon }, { where: { IDNhomMon: id } });
            res.status(200).send({
                data: response,
                code: 'UPDATE_NHOMMON_SUCCESS',
                mess: 'Cập nhật nhóm món thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });
export default routerNhomMon;