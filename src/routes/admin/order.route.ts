import express, { Request, Response } from 'express';
import { HoaDon, ChiTietHD } from '../../models/init-models';
import { GetCurrentUser } from '../../utils/index';
import { paths } from '.';
import { or } from 'sequelize';

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

    export default routerOrder;