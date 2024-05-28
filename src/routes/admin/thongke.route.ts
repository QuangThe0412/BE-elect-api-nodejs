import express, { Request, Response } from 'express';
import { HoaDon, ChiTietHD, KhachHang,Mon } from '../../models/init-models';
import { Op } from 'sequelize';

const routerThongKe = express.Router();

//get thong ke
routerThongKe.get(
    '/',
    async (req: Request, res: Response) => {
        try {
            let dateFrom = req?.query?.dateFrom ? new Date(req.query.dateFrom as string) : new Date(new Date().getFullYear(), 0, 1);
            let dateTo = req?.query?.dateTo ? new Date(req.query.dateTo as string) : new Date();
            dateFrom.setHours(0, 0, 0, 0);
            dateTo.setHours(23, 59, 59, 999);

            //generate date array
            let dateArray = [];
            let currentDate = new Date(dateFrom);
            
            while (currentDate <= dateTo) {
                dateArray.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }

            //get hoa don
            let hoaDon = await HoaDon.findAll({
                where: {
                    NgayLap: {
                        [Op.between]: [dateFrom, dateTo]
                    }
                },
                attributes: ['IDHoaDon', 'IDKhachHang', 'NgayLap']
            });
            let hoaDonMap = new Map(hoaDon.map(hd => [hd.IDHoaDon, hd.NgayLap]));

            let khachHang = await KhachHang.findAll({
                where: {
                    IDKhachHang: {
                        [Op.in]: Array.from(hoaDon.map(hd => hd.IDKhachHang))
                    }
                },
                attributes: ['IDKhachHang', 'TenKhachHang']
            });
            let khachHangMap = new Map(khachHang.map(kh => [kh.IDKhachHang, kh.TenKhachHang]));

            let chiTietHD = await ChiTietHD.findAll({
                where: {
                    IDHoaDon: {
                        [Op.in]: Array.from(hoaDonMap.keys())
                    }
                }
            });

            let mon = await Mon.findAll({
                where: {
                    IDMon: {
                        [Op.in]: Array.from(chiTietHD.map(ct => ct.IDMon))
                    }
                },
                attributes: ['IDMon', 'TenMon']
            });

            let monMap = new Map(mon.map(m => [m.IDMon, m.TenMon]));

            let result = chiTietHD.map(chiTiet => ({
                ...chiTiet,
                NgayLap: hoaDonMap.get(chiTiet.IDHoaDon),
                TenKhachHang: khachHangMap.get(hoaDon.find(hd => hd.IDHoaDon === chiTiet.IDHoaDon).IDKhachHang),
                TenMon: monMap.get(chiTiet.IDMon)
            }));

            res.status(200).send({
                data: result,
                code: 'GET_THONG_KE_SUCCESS',
                mess: 'Get thong ke success!',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

export default routerThongKe;