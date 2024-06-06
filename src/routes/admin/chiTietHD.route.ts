import express, { Request, Response } from 'express';
import { ChiTietHD } from '../../models/init-models';
import { GetCurrentUser, STATUS_ENUM } from '../../utils/index';

const routerChiTietHD = express.Router();

//get details
routerChiTietHD.get(
    '/:id',
    async (req: Request, res: Response) => {
        try {
            const id = req.params.id;

            if (!id) {
                return res.status(400).send({
                    code: 'CHITIETHD_ID_INVALID',
                    mess: 'ID chi tiết hóa đơn không hợp lệ',
                });
            }

            const chiTietHD = await ChiTietHD.findOne({
                where: {
                    IDHoaDon: id,
                },
            });

            if (!chiTietHD) {
                return res.status(404).send({
                    code: 'CHITIETHD_NOT_FOUND',
                    mess: 'Chi tiết hóa đơn không tồn tại',
                });
            }

            res.status(200).send({
                data: chiTietHD,
                code: 'GET_CHITIETHD_SUCCESS',
            });

        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//update
routerChiTietHD.put(
    '/:id',
    async (req: Request, res: Response) => {
        try {
            const chiTietHD = req.body as ChiTietHD;
            const { IDMon, SoLuong, ChietKhau } = chiTietHD;
            const id = req.params.id;
            if (!id) {
                return res.status(400).send({
                    code: 'CHITIETHD_INVALID',
                    mess: 'Chi tiết hóa đơn không hợp lệ',
                });
            }

            const chiTietHDUpdate = await ChiTietHD.findByPk(id);
            if (!chiTietHDUpdate) {
                return res.status(404).send({
                    code: 'CHITIETHD_NOT_FOUND',
                    mess: 'Chi tiết hóa đơn không tồn tại',
                });
            }

            if (!ChietKhau || ChietKhau < 0 || ChietKhau > 100 || !SoLuong || SoLuong < 0 || !IDMon) {
                return res.status(400).send({
                    code: 'CHITIETHD_INVALID',
                    mess: 'Chi tiết hóa đơn không hợp lệ',
                });
            }

            const moneyBeforeDiscount = chiTietHDUpdate.DonGia * SoLuong;
            const moneyDiscount = chiTietHDUpdate.DonGia * (ChietKhau / 100);
            const moneyAfterDiscount = moneyBeforeDiscount - moneyDiscount;

            chiTietHDUpdate.TienCK = moneyDiscount;
            chiTietHDUpdate.TienSauCK = moneyAfterDiscount;
            chiTietHDUpdate.TienSauCK = moneyAfterDiscount;
            chiTietHDUpdate.IDMon = IDMon;
            chiTietHDUpdate.SoLuong = SoLuong;
            chiTietHDUpdate.ChietKhau = ChietKhau;
            chiTietHDUpdate.modifyBy = await GetCurrentUser(req);
            chiTietHDUpdate.modifyDate = new Date();

            const result = await ChiTietHD.update(chiTietHDUpdate, {
                where: {
                    IDChiTietHD: id,
                },
            });

            res.status(200).send({
                data: result,
                code: 'UPDATE_CHITIETHD_SUCCESS',
                mess: 'Cập nhật chi tiết hóa đơn thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//delete
routerChiTietHD.delete(
    '/:id',
    async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            if (!id) {
                return res.status(400).send({
                    code: 'CHITIETHD_ID_INVALID',
                    mess: 'ID chi tiết hóa đơn không hợp lệ',
                });
            }

            const chiTietHD = await ChiTietHD.findByPk(id);
            if (!chiTietHD) {
                return res.status(404).send({
                    code: 'CHITIETHD_NOT_FOUND',
                    mess: 'Chi tiết hóa đơn không tồn tại',
                });
            }

            chiTietHD.Deleted = true;
            chiTietHD.modifyBy = await GetCurrentUser(req);
            chiTietHD.modifyDate = new Date();

            await ChiTietHD.update(chiTietHD, {
                where: {
                    IDChiTietHD: id,
                },
            });
            res.status(200).send({
                code: 'DELETE_CHITIETHD_SUCCESS',
                mess: 'Xóa chi tiết hóa đơn thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

export default routerChiTietHD;

