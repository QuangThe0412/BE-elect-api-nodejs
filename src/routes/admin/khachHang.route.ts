import express, { Request, Response } from 'express';
import { KhachHang } from '../../models/init-models';
import { GetCurrentUser, HashPassword, IsAdmin, MergeWithOldData } from '../../utils';
import { Op } from 'sequelize';
import config from '../../config/config';

const routerKhachHang = express.Router();

//get all
routerKhachHang.get('/', async (req: Request, res: Response) => {
    try {
        let result: KhachHang[] = await KhachHang.findAll({
            order: [['IDKhachHang', 'DESC']],
        });

        result.map((khachHang) => {
            khachHang.password = null;
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
        const idAdmin = await IsAdmin(req, res);
        if (!idAdmin) {
            return res.status(403).send({
                code: 'PERMISSION_DENIED',
                mess: 'Bạn không có quyền thực hiện hành động này',
            });
        }

        const khachHang = req.body as KhachHang;
        khachHang.IDKhachHang = null;

        const { username, password, DienThoai,IDLoaiKH } = khachHang;

        if (!username || !password) {
            return res.status(400).send({
                code: 'USERNAME_PASSWORD_REQUIRED',
                mess: 'Username và password không được để trống',
            });
        }

        const existedKhachHang = await KhachHang.findOne({
            where: {
                [Op.or]: [
                    { username: username },
                    { DienThoai: DienThoai }
                ]
            }
        });

        if (existedKhachHang) {
            return res.status(400).send({
                code: 'USERNAME_PHONE_EXISTED',
                mess: 'Username hoặc số điện thoại đã tồn tại',
            });
        }

        khachHang.IDLoaiKH = IDLoaiKH;
        khachHang.password = await HashPassword(username, password,config.ADMIN_ACCESS_SECRET);
        khachHang.createDate = new Date();
        khachHang.createBy = await GetCurrentUser(req,null);

        const result = await KhachHang.create(khachHang);
        result.dataValues.password = null;

        res.status(201).send({
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

        result.password = null;

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
        const isAdmin = await IsAdmin(req, res);
        if (!isAdmin) {
            return res.status(403).send({
                code: 'PERMISSION_DENIED',
                mess: 'Bạn không có quyền thực hiện hành động này',
            });
        }

        const { id } = req.params;

        if (!id) {
            return res.status(400).send({
                code: 'ID_REQUIRED',
                mess: 'ID không được để trống',
            });
        }

        const khachHang = await KhachHang.findOne({ where: { IDKhachHang: id } });
        if (!khachHang) {
            return res.status(404).send({
                code: 'KHACHHANG_NOT_FOUND',
                mess: 'Không tìm thấy khách hàng',
            });
        }

        const { username, DienThoai, TenKhachHang, password,IDLoaiKH } = req.body as KhachHang;

        //check if change username
        if (username && username !== khachHang.username) {
            return res.status(400).send({
                code: 'USERNAME_NOT_ALLOWED',
                mess: 'Không được phép cập nhật username',
            });
        }

        //check if change DienThoai
        if (DienThoai && DienThoai !== khachHang.DienThoai) {
            const existedKhachHangByPhone = await KhachHang.findOne({
                where: {
                    DienThoai: DienThoai,
                }
            });

            if (existedKhachHangByPhone) {
                return res.status(400).send({
                    code: 'PHONE_EXISTED',
                    mess: 'Số điện thoại đã tồn tại',
                });
            }
            khachHang.DienThoai = DienThoai;
        }

        //check if change password
        if(password){
            khachHang.password = await HashPassword(khachHang.username, password,config.ADMIN_ACCESS_SECRET);
        }

        khachHang.IDLoaiKH = IDLoaiKH;
        khachHang.TenKhachHang = TenKhachHang;
        khachHang.modifyDate = new Date();
        khachHang.modifyBy = await GetCurrentUser(req,null);

        await KhachHang.update(khachHang, { where: { IDKhachHang: id } });
        khachHang.password = null;

        res.status(200).send({
            data: khachHang,
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
        const isAdmin = await IsAdmin(req, res);
        if (!isAdmin) {
            return res.status(403).send({
                code: 'PERMISSION_DENIED',
                mess: 'Bạn không có quyền thực hiện hành động này',
            });
        }

        const { id } = req.params;

        if (!id) {
            return res.status(400).send({
                code: 'ID_REQUIRED',
                mess: 'ID không được để trống',
            });
        }

        let khachHang = await KhachHang.findOne({ where: { IDKhachHang: id } });

        if (!khachHang) return res.status(404).send({
            code: 'KHACHHANG_NOT_FOUND',
            mess: 'Không tìm thấy khách hàng',
        });

        khachHang.Deleted = !khachHang.Deleted;
        khachHang.modifyDate = new Date();
        khachHang.modifyBy = await GetCurrentUser(req,null);

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