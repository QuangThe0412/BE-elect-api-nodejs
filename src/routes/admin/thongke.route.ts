import express, { Request, Response } from 'express';
import { HoaDon, ChiTietHD, KhachHang, Mon } from '../../models/init-models';
import { Op } from 'sequelize';

const routerThongKe = express.Router();

//get thong ke
routerThongKe.get(
    '/',
    async (req: Request, res: Response) => {
        try {
            let dateFrom = req?.query?.dateFrom ? new Date(req.query.dateFrom as string) : new Date(new Date().getFullYear(), 0, 1);
            let dateTo = req?.query?.dateTo ? new Date(req.query.dateTo as string) : new Date();

            let result = await getThongKe(dateFrom, dateTo);

            res.status(200).send({
                data: result,
                code: 'GET_THONG_KE_SUCCESS',
                mess: 'Nhận thông tin thống kê thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//get thong ke by week
routerThongKe.get('/by-week', async (req: Request, res: Response) => {
    try {
        let date = new Date();
        let diffToMonday = (date.getDay() + 6) % 7;
        let dateFrom = new Date(date.getFullYear(), date.getMonth(), date.getDate() - diffToMonday);
        let dateTo = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (6 - diffToMonday));

        let result = await getThongKe(dateFrom, dateTo);

        res.status(200).send({
            data: result,
            code: 'GET_THONG_KE_SUCCESS',
            mess: 'Nhận thông tin thống kê thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//get thong ke by month
routerThongKe.get('/by-month', async (req: Request, res: Response) => {
    try {
        let date = new Date();
        let dateFrom = new Date(date.getFullYear(), date.getMonth(), 1);
        let dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        let result = await getThongKe(dateFrom, dateTo);

        res.status(200).send({
            data: result,
            code: 'GET_THONG_KE_SUCCESS',
            mess: 'Nhận thông tin thống kê thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send
    }
});

async function getThongKe(dateFrom: Date, dateTo: Date) {
    dateFrom.setUTCHours(0, 0, 0, 0);
    dateTo.setUTCHours(23, 59, 59, 999);

    let dateArray = [];
    for (let d = new Date(dateFrom); d <= dateTo; d.setDate(d.getDate() + 1)) {
        dateArray.push(new Date(d));
    }

    let hoaDon = await HoaDon.findAll({
        where: { createDate: { [Op.between]: [dateFrom, dateTo] } },
        attributes: ['IDHoaDon', 'IDKhachHang', 'createDate', 'TrangThai']
    });

    let khachHang = await KhachHang.findAll({
        where: { IDKhachHang: { [Op.in]: hoaDon.map(hd => hd.IDKhachHang) } },
        attributes: ['IDKhachHang', 'TenKhachHang']
    });

    let chiTietHD = await ChiTietHD.findAll({
        where: { IDHoaDon: { [Op.in]: hoaDon.map(hd => hd.IDHoaDon) } }
    });

    let mon = await Mon.findAll({
        where: { IDMon: { [Op.in]: chiTietHD.map(ct => ct.IDMon) } },
        attributes: ['IDMon', 'TenMon']
    });

    let result = chiTietHD.map(chiTiet => ({
        ...chiTiet,
        TrangThai: hoaDon.find(hd => hd.IDHoaDon === chiTiet.IDHoaDon).TrangThai,
        createDate: hoaDon.find(hd => hd.IDHoaDon === chiTiet.IDHoaDon).createDate,
        TenKhachHang: khachHang.find(kh => kh.IDKhachHang === hoaDon.find(hd => hd.IDHoaDon === chiTiet.IDHoaDon).IDKhachHang).TenKhachHang,
        TenMon: mon.find(m => m.IDMon === chiTiet.IDMon).TenMon,
    }));

    return result;
}
export default routerThongKe;