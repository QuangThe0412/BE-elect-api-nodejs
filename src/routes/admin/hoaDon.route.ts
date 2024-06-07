import express, { Request, Response } from 'express';
import { ChiTietHD, HoaDon } from '../../models/init-models';
import { GetCurrentUser, IsPendingStatus, STATUS_ENUM } from '../../utils/index';

const routerOrder = express.Router();

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

export default routerOrder;