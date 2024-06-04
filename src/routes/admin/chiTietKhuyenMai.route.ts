import express, { Request, Response } from 'express';
import { ChiTietKM } from '../../models/init-models';
import { GetCurrentUser } from '../../utils/index';

const routerChiTietKM = express.Router();

//create
routerChiTietKM.post(
    '/',
    async (req: Request, res: Response) => {
        try {
            const chiTietKM = req.body as ChiTietKM;
            chiTietKM.IDChiTietKM = null;

            chiTietKM.createBy = await GetCurrentUser(req);
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

            chiTietKM.modifyBy = await GetCurrentUser(req);
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

            chiTietKM.modifyBy = await GetCurrentUser(req);
            chiTietKM.modifyDate = new Date();

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