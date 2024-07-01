import express, { Request, Response } from 'express';
import { ChiTietKM, Khuyenmai } from '../../models/init-models';
import { GetCurrentUser } from '../../utils/index';

const routerChiTietKM = express.Router();

//create
routerChiTietKM.post(
    '/',
    async (req: Request, res: Response) => {
        try {
            const chiTietKM = req.body as ChiTietKM;
            chiTietKM.IDChiTietKM = null;

            const { IDKhuyenMai, IDMon } = chiTietKM;
            if (!IDKhuyenMai || !IDMon) {
                return res.status(400).send({
                    code: 'CHITIETKM_INVALID',
                    mess: 'Chi tiết khuyến mãi không hợp lệ',
                });
            }

            //check exist product
            const getChiTietKMByIDMon = await ChiTietKM.findOne({
                where: {
                    IDKhuyenMai: IDKhuyenMai,
                    IDMon: IDMon,
                    Deleted: false,
                },
            });

            if (getChiTietKMByIDMon) {
                return res.status(400).send({
                    code: 'CHITIETKM_EXISTED',
                    mess: 'Món đã tồn tại trong khuyến mãi này',
                });
            }

            chiTietKM.createBy = await GetCurrentUser(req,null);
            chiTietKM.createDate = new Date();

            await ChiTietKM.create(chiTietKM);
            res.status(201).send({
                code: 'CREATE_CHITIETKM_SUCCESS',
                mess: 'Tạo chi tiết khuyến mãi thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//update
routerChiTietKM.put(
    '/:id',
    async (req: Request, res: Response) => {
        try {
            const chiTietKM = req.body as ChiTietKM;
            const id = req.params.id;
            if(!id) {
                return res.status(400).send({
                    code: 'CHITIETKM_ID_INVALID',
                    mess: 'ID chi tiết khuyến mãi không hợp lệ',
                });
            }

            //check exist product
            const { IDKhuyenMai, IDMon } = chiTietKM;
            const getChiTietKMByIDMon = await ChiTietKM.findOne({
                where: {
                    IDKhuyenMai: IDKhuyenMai,
                    IDMon: IDMon,
                    Deleted: false,
                },
            });

            if (getChiTietKMByIDMon && getChiTietKMByIDMon.IDChiTietKM !== Number(id)) {
                return res.status(400).send({
                    code: 'CHITIETKM_EXISTED',
                    mess: 'Món đã tồn tại trong khuyến mãi này',
                });
            }

            chiTietKM.modifyBy = await GetCurrentUser(req,null);
            chiTietKM.modifyDate = new Date();

            await ChiTietKM.update(chiTietKM, {
                where: {
                    IDChiTietKM: id,
                },
            });
            res.status(200).send({
                code: 'UPDATE_CHITIETKM_SUCCESS',
                mess: 'Cập nhật chi tiết khuyến mãi thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//delete
routerChiTietKM.delete(
    '/:id',
    async (req: Request, res: Response) => {
        try {
            const id = req.params.id;

            const chiTietKM = await ChiTietKM.findByPk(id);
            if (!chiTietKM) {
                return res.status(404).send({
                    code: 'CHITIETKM_NOT_FOUND',
                    mess: 'Không tìm thấy chi tiết khuyến mãi',
                });
            }

            chiTietKM.modifyBy = await GetCurrentUser(req,null);
            chiTietKM.modifyDate = new Date();
            chiTietKM.Deleted = true;

            await ChiTietKM.update(chiTietKM, {
                where: {
                    IDChiTietKM: id,
                },
            });

            res.status(200).send({
                code: 'DELETE_CHITIETKM_SUCCESS',
                mess: 'Xóa chi tiết khuyến mãi thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

export default routerChiTietKM;