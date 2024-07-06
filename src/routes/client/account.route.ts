import express, { NextFunction, Response } from 'express';
import { Request } from '../../index';
import { GetCurrentUserData } from '../../utils';
import { AuthUser } from '../../index';
import { KhachHang } from '../../models/init-models';
import config from '../../config/config';
import { ComparePassword, HashPassword, GetCurrentUser, IsAdmin } from '../../utils';

const routerAccount = express.Router();

routerAccount.get(
    '/profile',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let user = await GetCurrentUserData(req, config.ACCESS_TOKEN_SECRET) as AuthUser;

            if (!user) {
                return res.status(401).json({
                    code: 'unauthorized',
                    mess: 'Chưa đăng nhập',
                });
            }

            const khachHang = await KhachHang.findOne({
                where: {
                    IDKhachHang: user.userId,
                    Deleted: false,
                },
            });

            if (!khachHang) {
                return res.status(400).json({
                    code: 'user_not_found',
                    mess: 'Người dùng không tồn tại hoặc đã bị xóa',
                });
            }

            const result = {
                IDKhachHang: khachHang.IDKhachHang,
                IDLoaiKH: khachHang.IDLoaiKH,
                TenKhachHang: khachHang.TenKhachHang,
                UserName: khachHang.username,
                DienThoai: khachHang.DienThoai,
            };

            return res.status(200).send({
                data: result,
                code: 'GET_ME_SUCCESS',
                mess: 'Lấy thông tin người dùng thành công',
            });
        } catch (error) {
            next(error);
        }
    }
);

routerAccount.put(
    '/profile',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let user = await GetCurrentUserData(req, config.ACCESS_TOKEN_SECRET) as AuthUser;

            if (!user) {
                return res.status(401).json({
                    code: 'unauthorized',
                    mess: 'Chưa đăng nhập',
                });
            }

            const khachHang = await KhachHang.findOne({
                where: {
                    IDKhachHang: user.userId,
                    Deleted: false,
                },
            });

            if (!khachHang) {
                return res.status(400).json({
                    code: 'user_not_found',
                    mess: 'Người dùng không tồn tại hoặc đã bị xóa',
                });
            }

            const { name, phone } = req.body;
            khachHang.TenKhachHang = name;
            khachHang.DienThoai = phone;
            khachHang.modifyDate = new Date();
            khachHang.modifyBy = user.username;

            await KhachHang.update(khachHang, {
                where: {
                    IDKhachHang: user.userId,
                },
            });

            return res.status(200).send({
                data: { ...khachHang },
                code: 'UPDATE_ME_SUCCESS',
                mess: 'Cập nhật thông tin người dùng thành công',
            });

        } catch (error) {
            next(error);
        }
    });

routerAccount.put(
    '/change-password',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let user = await GetCurrentUserData(req, config.ACCESS_TOKEN_SECRET) as AuthUser;

            if (!user) {
                return res.status(401).json({
                    code: 'unauthorized',
                    mess: 'Chưa đăng nhập',
                });
            }

            const khachHang = await KhachHang.findOne({
                where: {
                    IDKhachHang: user.userId,
                    Deleted: false,
                },
            });

            if (!khachHang) {
                return res.status(400).json({
                    code: 'user_not_found',
                    mess: 'Người dùng không tìm thấy hoặc đã bị xóa',
                });
            }

            const { oldPassword, newPassword } = req.body;

            if (!(await ComparePassword(user.username, oldPassword, khachHang.password))) {
                return res.status(400).json({
                    code: 'incorrect_old_password',
                    mess: 'Mật khẩu hiện tại không đúng',
                });
            }

            const newPwd = await HashPassword(user.username, newPassword);
            khachHang.password = newPwd;
            khachHang.modifyDate = new Date();
            khachHang.modifyBy = user.username;

            await KhachHang.update(khachHang, { where: { IDKhachHang: user.userId } });
            res.status(200).send({
                data: {},
                code: 'CHANGE_PASSWORD_SUCCESS',
                mess: 'Đổi mật khẩu thành công',
            });
        } catch (err) {
            res.status(500).send(err);
        }
    });

export default routerAccount;