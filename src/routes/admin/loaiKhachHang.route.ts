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

        const { TenLoaiKH, MoTa } = loaiKhachHang;

        if (!TenLoaiKH) {
            return res.status(400).send({
                code: 'TENLOAIKH_PHANTRAMGG_REQUIRED',
                mess: 'Tên loại khách hàng không được để trống',
            });
        }


        if (TenLoaiKH) {
            const existedLoaiKhachHangByName = await LoaiKhachHang.findOne({
                where: {
                    TenLoaiKH: TenLoaiKH,
                },
            });

            if (existedLoaiKhachHangByName) {
                return res.status(400).send({
                    code: 'LOAIKHACHHANG_EXISTED',
                    mess: 'Tên loại khách hàng đã tồn tại',
                });
            }

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
        loaiKhachHang.MoTa = MoTa;

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
routerLoaiKhachHang.put('/:IDLoaiKH', async (req: Request, res: Response) => {
    try {
        const { IDLoaiKH } = req.params;
        const loaiKhachHang = req.body as LoaiKhachHang;

        const existedLoaiKhachHang = await LoaiKhachHang.findOne({
            where: {
                IDLoaiKH: IDLoaiKH,
            },
        });

        if (!existedLoaiKhachHang) {
            return res.status(404).send({
                code: 'LOAIKHACHHANG_NOT_FOUND',
                mess: 'Loại khách hàng không tồn tại',
            });
        }

        const { TenLoaiKH, MoTa } = loaiKhachHang;

        if (!TenLoaiKH) {
            return res.status(400).send({
                code: 'TENLOAIKH_PHANTRAMGG_REQUIRED',
                mess: 'Tên loại khách hàng không được để trống',
            });
        }

        if (TenLoaiKH && existedLoaiKhachHang.TenLoaiKH !== TenLoaiKH) {
            const existedLoaiKhachHangByName = await LoaiKhachHang.findOne({
                where: {
                    TenLoaiKH: TenLoaiKH,
                },
            });

            if (existedLoaiKhachHangByName) {
                return res.status(400).send({
                    code: 'LOAIKHACHHANG_EXISTED',
                    mess: 'Tên loại khách hàng đã tồn tại',
                });
            }

        }

        existedLoaiKhachHang.TenLoaiKH = TenLoaiKH;
        existedLoaiKhachHang.MoTa = MoTa;

        await LoaiKhachHang.update(existedLoaiKhachHang, { where: { IDLoaiKH: IDLoaiKH } });

        res.status(200).send({
            data: existedLoaiKhachHang,
            code: 'UPDATE_LOAIKHACHHANG_SUCCESS',
            mess: 'Cập nhật loại khách hàng thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

export default routerLoaiKhachHang;