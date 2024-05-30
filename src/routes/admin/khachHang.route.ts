import express, { Request, Response } from 'express';
import { KhachHang } from '../../models/init-models';
import { MergeWithOldData } from '../../utils';

const routerKhachHang = express.Router();

//get all
routerKhachHang.get('/', async (req: Request, res: Response) => {
    try {
        let result: KhachHang[] = await KhachHang.findAll({
            order: [['IDKhachHang', 'DESC']],
        });
        res.status(200).send({
            data: result,
            code: 'GET_ALL_KHACHHANG_SUCCESS',
            mess: 'Nhận danh sách khách hàng thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//create
routerKhachHang.post('/', async (req: Request, res: Response) => {
    try {
        const khachHang = req.body as KhachHang;
        khachHang.NgayTao = new Date();
        const result = await KhachHang.create(khachHang);
        res.status(200).send({
            data: result,
            code: 'CREATE_KHACHHANG_SUCCESS',
            mess: 'Tạo khách hàng thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//get details
routerKhachHang.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await KhachHang.findOne({
            where: {
                IDKhachHang: id,
            },
        })
        res.status(200).send({
            data: result,
            code: 'GET_KHACHHANG_SUCCESS',
            mess: 'Nhận thông tin khách hàng thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//update
routerKhachHang.put('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let khachHang = req.body as KhachHang;

        if (!id) return res.status(400).send('id is required');

        const oldKhachHang = await KhachHang.findOne({ where: { IDKhachHang: id } });
        if (!oldKhachHang) return res.status(404).send('KhachHang not found');

        khachHang = MergeWithOldData(oldKhachHang, khachHang);
        khachHang.NgaySua = new Date();

        const response = await KhachHang.update(khachHang, { where: { IDKhachHang: id } });
        res.status(200).send({
            data: response,
            code: 'UPDATE_KHACHHANG_SUCCESS',
            mess: 'Cập nhật khách hàng thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//delete
routerKhachHang.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).send('id is required');

        let khachHang = await KhachHang.findOne({ where: { IDKhachHang: id } });

        if (!khachHang) return res.status(404).send({
            code: 'KHACHHANG_NOT_FOUND',
            mess: 'Không tìm thấy khách hàng',
        });

        khachHang.Deleted = !khachHang.Deleted;
        khachHang.NgaySua = new Date();

        const response = await KhachHang.update(khachHang, { where: { IDKhachHang: id } });
        res.status(200).send({
            data: response,
            code: 'DELETE_KHACHHANG_SUCCESS',
            mess: 'Bật/tắt khách hàng thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

export default routerKhachHang;