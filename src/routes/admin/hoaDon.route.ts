import express, { Request, Response } from 'express';
import { ChiTietHD, HoaDon } from '../../models/init-models';
import { GetCurrentUser, IsPendingStatus, STATUS_ENUM } from '../../utils/index';
import { Money } from 'mssql';

const routerOrder = express.Router();

type _orderDetails = {
    IDMon: number;
    SoLuong?: number;
    DonGia?: number;
    ChietKhau?: number;
}

interface _order {
    IDKhachHang?: number;
    CongNo?: number;
    TrangThai?: number;
    data: _orderDetails[];
}

//get all
routerOrder.get(
    '/',
    async (req: Request, res: Response) => {
        try {
            let result: HoaDon[] = await HoaDon.findAll({
                order: [['IDHoaDon', 'DESC']],
            });
            res.status(200).send({
                data: result,
                code: 'GET_ALL_ORDER_SUCCESS',
                mess: 'Nhận danh sách đơn hàng thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//update status
routerOrder.put(
    '/update-status/:id',
    async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const status = req.body.status;

            const order = await HoaDon.findByPk(id);
            if (!order) {
                return res.status(404).send({
                    code: 'ORDER_NOT_FOUND',
                    mess: 'Không tìm thấy đơn hàng',
                });
            }

            if (status < 0 || !Object.values(STATUS_ENUM).includes(status)) {
                return res.status(400).send({
                    code: 'INVALID_STATUS',
                    mess: 'Trạng thái không hợp lệ',
                });
            }

            order.TrangThai = status;

            order.modifyDate = new Date();
            order.modifyBy = await GetCurrentUser(req);

            HoaDon.update(order, {
                where: {
                    IDHoaDon: id,
                },
            });

            res.status(200).send({
                data: order,
                code: 'UPDATE_ORDER_STATUS_SUCCESS',
                mess: 'Cập nhật trạng thái đơn hàng thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//get all details of order
routerOrder.get(
    '/:idOrder' + '/chiTietHoaDon',
    async (req: Request, res: Response) => {
        try {
            const idOrder = req.params.idOrder;
            const hoaDon = await HoaDon.findByPk(idOrder);
            if (!hoaDon) {
                return res.status(404).send({
                    code: 'ORDER_NOT_FOUND',
                    mess: 'Không tìm thấy đơn hàng',
                });
            }

            const result = await ChiTietHD.findAll({
                where: {
                    IDHoaDon: idOrder,
                },
                order: [['IDChiTietHD', 'DESC']],
            });

            res.status(200).send({
                data: result,
                code: 'GET_ALL_ORDER_DETAIL_SUCCESS',
                mess: 'Nhận danh sách chi tiết đơn hàng thành công',
            });

        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//create 
routerOrder.post(
    '/',
    async (req: Request, res: Response) => {
        try {
            const letUser = await GetCurrentUser(req);
            const newOrder = req.body as _order;
            const { IDKhachHang, CongNo, TrangThai, data } = newOrder;
            const orderDetails = data;
            console.log({ orderDetails });

            if (!IDKhachHang || TrangThai < 0 || !orderDetails || orderDetails.length === 0) {
                return res.status(400).send({
                    code: 'MISSING_FIELDS',
                    mess: 'Thiếu dữ liệu bắt buộc',
                });
            }
            
            const status = STATUS_ENUM[TrangThai];
            if (!status) {
                return res.status(400).send({
                    code: 'INVALID_STATUS',
                    mess: 'Trạng thái không hợp lệ',
                });
            }

            const order = new HoaDon();
            order.IDKhachHang = IDKhachHang;
            order.CongNo = CongNo;
            order.TrangThai = TrangThai;
            order.createDate = new Date();
            order.createBy = letUser;

            const createdOrder = await HoaDon.create(order);

            const arrayOrderDetailsCreate: ChiTietHD[] = orderDetails.map((item: _orderDetails) => {
                let itemArray: ChiTietHD = new ChiTietHD();
                itemArray.IDHoaDon = createdOrder.IDHoaDon;
                itemArray.IDMon = item.IDMon;
                itemArray.SoLuong = item.SoLuong;
                itemArray.DonGia = item.DonGia;
                itemArray.ChietKhau = item.ChietKhau;

                const MoneyBeforeDiscount = item.SoLuong * item.DonGia;
                const MoneyDiscount = MoneyBeforeDiscount * (item.ChietKhau / 100);
                const MoneyAfterDiscount = MoneyBeforeDiscount - MoneyDiscount;

                itemArray.TienChuaCK = MoneyBeforeDiscount;
                itemArray.TienCK = MoneyDiscount;
                itemArray.TienSauCK = MoneyAfterDiscount;
                itemArray.createDate = new Date();
                itemArray.createBy = letUser;

                return itemArray;
            });

            await ChiTietHD.bulkCreate(arrayOrderDetailsCreate);

            res.status(201).send({
                data: createdOrder,
                code: 'CREATE_ORDER_AND_DETAILS_ORDER_SUCCESS',
                mess: 'Tạo đơn và chi tiết hóa đơn hàng thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

export default routerOrder;