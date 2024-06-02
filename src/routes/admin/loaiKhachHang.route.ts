import express, { Request, Response } from 'express';
import { LoaiKhachHang } from '../../models/init-models';

const routerLoaiKhachHang = express.Router();

//get all
routerLoaiKhachHang.get('/', async (req: Request, res: Response) => {
    try {
        let result: LoaiKhachHang[] = await LoaiKhachHang.findAll({
            order: [['IDLoaiKH', 'DESC']],
        });

        res.status(200).send({
            data: result,
            code: 'GET_ALL_LOAIKHACHHANG_SUCCESS',
            mess: 'Nhận danh sách loại khách hàng thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//create
routerLoaiKhachHang.post('/', async (req: Request, res: Response) => {
    try {
        const loaiKhachHang = req.body as LoaiKhachHang;
        loaiKhachHang.IDLoaiKH = null;

        const { TenLoaiKH } = loaiKhachHang;

        if (!TenLoaiKH) {
            return res.status(400).send({
                code: 'TENLOAIKH_PHANTRAMGG_REQUIRED',
                mess: 'Tên loại khách hàng và phần trăm giảm giá không được để trống',
            });
        }

        const existedLoaiKhachHang = await LoaiKhachHang.findOne({
            where: {
                TenLoaiKH: TenLoaiKH,
            },
        });

        if (existedLoaiKhachHang) {
            return res.status(400).send({
                code: 'LOAIKHACHHANG_EXISTED',
                mess: 'Loại khách hàng đã tồn tại',
            });
        }

        const result = await LoaiKhachHang.create(loaiKhachHang);
        res.status(201).send({
            data: result,
            code: 'CREATE_LOAIKHACHHANG_SUCCESS',
            mess: 'Tạo loại khách hàng thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//detail
routerLoaiKhachHang.get('/:IDLoaiKH', async (req: Request, res: Response) => {
    try {
        const { IDLoaiKH } = req.params;

        const loaiKhachHang = await LoaiKhachHang.findOne({
            where: {
                IDLoaiKH: IDLoaiKH,
            },
        });

        if (!loaiKhachHang) {
            return res.status(404).send({
                code: 'LOAIKHACHHANG_NOT_FOUND',
                mess: 'Loại khách hàng không tồn tại',
            });
        }

        res.status(200).send({
            data: loaiKhachHang,
            code: 'GET_LOAIKHACHHANG_SUCCESS',
            mess: 'Nhận thông tin loại khách hàng thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//update
routerLoaiKhachHang.put('/', async (req: Request, res: Response) => {
    try {
        const loaiKhachHang = req.body as LoaiKhachHang;

        const { IDLoaiKH, TenLoaiKH } = loaiKhachHang;

        if (!IDLoaiKH || !TenLoaiKH ) {
            return res.status(400).send({
                code: 'IDLOAIKH_TENLOAIKH_PHANTRAMGG_REQUIRED',
                mess: 'ID loại khách hàng, tên loại khách hàng và phần trăm giảm giá không được để trống',
            });
        }

        const existedLoaiKhachHang = await LoaiKhachHang.findOne({
            where: {
                IDLoaiKH: IDLoaiKH,
            },
        });

        if (!existedLoaiKhachHang) {
            return res.status(400).send({
                code: 'LOAIKHACHHANG_NOT_EXISTED',
                mess: 'Loại khách hàng không tồn tại',
            });
        }

        const result = await LoaiKhachHang.update(loaiKhachHang, {
            where: {
                IDLoaiKH: IDLoaiKH,
            },
        });

        res.status(200).send({
            data: result,
            code: 'UPDATE_LOAIKHACHHANG_SUCCESS',
            mess: 'Cập nhật loại khách hàng thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});