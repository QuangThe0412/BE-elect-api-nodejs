import express, { Request, Response } from 'express';
import { ChiTietHD, HoaDon, Mon } from '../../models/init-models';
import { GetCurrentUser, IsPendingStatus, STATUS_ENUM } from '../../utils/index';

const routerChiTietHD = express.Router();

//update
routerChiTietHD.put(
    '/:id',
    async (req: Request, res: Response) => {
        try {
            const chiTietHD = req.body as ChiTietHD;
            const { IDMon, SoLuong, ChietKhau, IDHoaDon, DonGia } = chiTietHD;
            const id = req.params.id;
            if (!id) {
                return res.status(400).send({
                    code: 'CHITIETHD_INVALID',
                    mess: 'Chi tiết hóa đơn không hợp lệ',
                });
            }

            const hoaDon = await HoaDon.findByPk(IDHoaDon);
            if (!hoaDon) {
                return res.status(404).send({
                    code: 'HOADON_NOT_FOUND',
                    mess: 'Hóa đơn không tồn tại',
                });
            }

            if (!IsPendingStatus(hoaDon.TrangThai)) {
                return res.status(400).send({
                    code: 'HOADON_INVALID',
                    mess: 'Trạng thái hóa đơn không hợp lệ',
                });
            }

            const chiTietHDUpdate = await ChiTietHD.findByPk(id);
            if (!chiTietHDUpdate) {
                return res.status(404).send({
                    code: 'CHITIETHD_NOT_FOUND',
                    mess: 'Chi tiết hóa đơn không tồn tại',
                });
            }

            if (ChietKhau < 0 || ChietKhau > 100 || !SoLuong || SoLuong < 0 || !IDMon) {
                return res.status(400).send({
                    code: 'CHITIETHD_INVALID',
                    mess: 'Chi tiết hóa đơn không hợp lệ',
                });
            }

            const product = await Mon.findByPk(IDMon);
            if (!product) {
                return res.status(404).send({
                    code: 'MON_NOT_FOUND',
                    mess: 'Món không tồn tại',
                });
            }

            //check mon existed in order
            console.log({ IDHoaDon });
            console.log('IDMon', IDMon);
            console.log(IDMon !== chiTietHDUpdate.IDMon)
            if (IDMon && IDMon !== chiTietHDUpdate.IDMon) {
                const monInOrder = await ChiTietHD.findAll({
                    where: {
                        IDHoaDon,
                        IDMon,
                        Deleted: false,
                    },
                });
                console.log('monInOrder', monInOrder);
                if (monInOrder.length > 0) {
                    return res.status(400).send({
                        code: 'MON_EXISTED',
                        mess: 'Món đã tồn tại trong hóa đơn',
                    });
                }
            }

            const TienChuaCK = DonGia * SoLuong;
            const TienCK = ChietKhau * TienChuaCK / 100;
            const TienSauCK = TienChuaCK - TienCK;

            chiTietHDUpdate.TienCK = TienCK;
            chiTietHDUpdate.DonGia = DonGia;
            chiTietHDUpdate.TienSauCK = TienSauCK;
            chiTietHDUpdate.TienChuaCK = TienChuaCK;
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

//create
routerChiTietHD.post(
    '/',
    async (req: Request, res: Response) => {
        try {
            const chiTietHD = req.body as ChiTietHD;
            const { IDMon, SoLuong, ChietKhau, IDHoaDon, DonGia } = chiTietHD;
            if (!IDMon || !SoLuong || SoLuong < 0 || !IDHoaDon || ChietKhau < 0 || ChietKhau > 100) {
                return res.status(400).send({
                    code: 'CHITIETHD_INVALID',
                    mess: 'Chi tiết hóa đơn không hợp lệ',
                });
            }

            const product = await Mon.findByPk(IDMon);
            if (!product) {
                return res.status(404).send({
                    code: 'MON_NOT_FOUND',
                    mess: 'Món không tồn tại',
                });
            }

            const hoaDon = await HoaDon.findByPk(IDHoaDon);
            if (!hoaDon) {
                return res.status(404).send({
                    code: 'ORDER_NOT_FOUND',
                    mess: 'Hóa đơn không tồn tại',
                });
            }

            if (!IsPendingStatus(hoaDon.TrangThai)) {
                return res.status(400).send({
                    code: 'ORDER_INVALID',
                    mess: 'Trạng thái hóa đơn không hợp lệ',
                });
            }

            //check mon existed in order
            const monInOrder = await ChiTietHD.findAll({
                where: {
                    IDHoaDon,
                    IDMon,
                    Deleted: false,
                },
            });

            if (monInOrder.length > 0) {
                return res.status(400).send({
                    code: 'MON_EXISTED',
                    mess: 'Món đã tồn tại trong hóa đơn',
                });
            }

            const TienChuaCK = DonGia * SoLuong;
            const TienCK = ChietKhau * TienChuaCK / 100;
            const TienSauCK = TienChuaCK - TienCK;

            const chiTietHDCreate = await ChiTietHD.create({
                IDMon,
                SoLuong,
                ChietKhau,
                IDHoaDon,
                DonGia: DonGia,
                TienCK: TienCK,
                TienSauCK: TienSauCK,
                TienChuaCK: TienChuaCK,
                createBy: await GetCurrentUser(req),
                createDate: new Date(),
            });

            res.status(201).send({
                data: chiTietHDCreate,
                code: 'CREATE_CHITIETHD_SUCCESS',
                mess: 'Tạo chi tiết hóa đơn thành công',
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

            const hoaDon = await HoaDon.findByPk(chiTietHD.IDHoaDon);
            if (!hoaDon) {
                return res.status(404).send({
                    code: 'ORDER_NOT_FOUND',
                    mess: 'Hóa đơn không tồn tại',
                });
            }
            if (!IsPendingStatus(hoaDon.TrangThai)) {
                return res.status(400).send({
                    code: 'ORDER_INVALID',
                    mess: 'Trạng thái hóa đơn không hợp lệ',
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

