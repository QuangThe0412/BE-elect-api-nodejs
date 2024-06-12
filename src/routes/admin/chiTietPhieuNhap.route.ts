import express, { Request, Response } from 'express';
import { ChiTietPhieuNhap, Mon, PhieuNhap } from '../../models/init-models';
import { GetCurrentUser } from '../../utils/index';
import e from 'express';

const routerChiTietPhieuNhap = express.Router();

//get all
routerChiTietPhieuNhap.get('/', async (req: Request, res: Response) => {
    try {
        let result: ChiTietPhieuNhap[] = await ChiTietPhieuNhap.findAll({
            order: [['IDChiTietPhieuNhap', 'DESC']],
        });

        res.status(200).send({
            data: result,
            code: 'GET_ALL_PHIEUNHAP_SUCCESS',
            mess: 'Nhận danh sách phiếu nhập thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//get by id
routerChiTietPhieuNhap.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        let result: ChiTietPhieuNhap = await ChiTietPhieuNhap.findOne({
            where: {
                IDPhieuNhap: id,
            }
        });

        if (!result) {
            return res.status(404).send({
                code: 'PHIEUNHAP_NOT_FOUND',
                mess: 'Không tìm thấy phiếu nhập',
            });
        }

        res.status(200).send({
            data: result,
            code: 'GET_PHIEUNHAP_SUCCESS',
            mess: 'Nhận phiếu nhập thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//update
routerChiTietPhieuNhap.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const chiTietPhieuNhap = await ChiTietPhieuNhap.findByPk(id);
        if (!chiTietPhieuNhap) {
            return res.status(404).send({
                code: 'PHIEUNHAP_NOT_FOUND',
                mess: 'Không tìm thấy phiếu nhập',
            });
        }

        const { IDPhieuNhap, IDMon, SoLuongNhap, DonGiaNhap, ChietKhau } = req.body as ChiTietPhieuNhap;

        if (!IDPhieuNhap || !IDMon || !SoLuongNhap || !DonGiaNhap || !ChietKhau) {
            return res.status(400).send({
                code: 'MISSING_INFO',
                mess: 'Thiếu trường thông tin',
            });
        }

        const mon = await Mon.findByPk(IDMon);
        if (!mon) {
            return res.status(404).send({
                code: 'MON_NOT_FOUND',
                mess: 'Không tìm thấy món',
            });
        }

        //check duplicate mon
        if (IDMon && IDMon !== chiTietPhieuNhap.IDMon) {
            const duplicateMon = await ChiTietPhieuNhap.findOne({
                where: {
                    IDPhieuNhap,
                    IDMon,
                }
            });
            if (duplicateMon) {
                return res.status(400).send({
                    code: 'DUPLICATE_MON',
                    mess: 'Món đã tồn tại trong phiếu nhập',
                });
            }
        }

        chiTietPhieuNhap.IDPhieuNhap = IDPhieuNhap;
        chiTietPhieuNhap.IDMon = IDMon;
        chiTietPhieuNhap.SoLuongNhap = SoLuongNhap;
        chiTietPhieuNhap.DonGiaNhap = DonGiaNhap;
        chiTietPhieuNhap.ChietKhau = ChietKhau;

        const thanhTien = SoLuongNhap * DonGiaNhap * (1 - ChietKhau / 100);
        chiTietPhieuNhap.ThanhTien = thanhTien;

        chiTietPhieuNhap.modifyDate = new Date();
        chiTietPhieuNhap.modifyBy = await GetCurrentUser(req);

        const result = await ChiTietPhieuNhap.update(chiTietPhieuNhap, {
            where: {
                IDChiTietPhieuNhap: id,
            }
        });

        //update Món trong bảng món
        const soLuongCu = chiTietPhieuNhap.SoLuongNhap;
        mon.SoLuongTonKho = mon.SoLuongTonKho - soLuongCu + SoLuongNhap;
        mon.modifyDate = new Date();
        mon.modifyBy = await GetCurrentUser(req);
        await Mon.update(mon, {
            where: {
                IDMon: IDMon,
            }
        });

        res.status(200).send({
            data: result,
            code: 'UPDATE_PHIEUNHAP_SUCCESS',
            mess: 'Cập nhật phiếu nhập thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//create
routerChiTietPhieuNhap.post('/', async (req: Request, res: Response) => {
    try {
        const chiTietPhieuNhap = req.body as ChiTietPhieuNhap;
        if (!chiTietPhieuNhap) {
            return res.status(400).send({
                code: 'MISSING_INFO',
                mess: 'Thiếu trường thông tin',
            });
        }

        let { IDPhieuNhap, IDMon, SoLuongNhap, DonGiaNhap, ChietKhau } = chiTietPhieuNhap;

        if (!IDPhieuNhap || !SoLuongNhap || !DonGiaNhap || !ChietKhau) {
            return res.status(400).send({
                code: 'MISSING_INFO',
                mess: 'Thiếu trường thông tin',
            });
        }

        //check duplicate mon
        const duplicateMon = await ChiTietPhieuNhap.findOne({
            where: {
                IDPhieuNhap,
                IDMon,
            }
        });
        if (duplicateMon) {
            return res.status(400).send({
                code: 'DUPLICATE_MON',
                mess: 'Món đã tồn tại trong phiếu nhập',
            });
        }

        const mon = await Mon.findByPk(IDMon);
        if (!mon) {
            return res.status(404).send({
                code: 'MON_NOT_FOUND',
                mess: 'Không tìm thấy món',
            });
        }

        const thanhTien = SoLuongNhap * DonGiaNhap * (1 - ChietKhau / 100);

        const newChiTietPhieuNhap = await ChiTietPhieuNhap.create({
            IDPhieuNhap,
            IDMon,
            SoLuongNhap,
            DonGiaNhap,
            ChietKhau,
            ThanhTien: thanhTien,
            createDate: new Date(),
            createBy: await GetCurrentUser(req),
        });

        //update Món trong bảng món
        mon.SoLuongTonKho = mon.SoLuongTonKho + SoLuongNhap;
        mon.modifyDate = new Date();
        mon.modifyBy = await GetCurrentUser(req);
        await Mon.update(mon, {
            where: {
                IDMon: IDMon,
            }
        });

        res.status(201).send({
            data: newChiTietPhieuNhap,
            code: 'CREATE_PHIEUNHAP_SUCCESS',
            mess: 'Tạo phiếu nhập thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

export default routerChiTietPhieuNhap;