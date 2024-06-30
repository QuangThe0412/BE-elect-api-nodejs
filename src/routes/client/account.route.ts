import express, { NextFunction, Response } from 'express';
import { Request } from '../../index';
import { GetCurrentUserData } from '../../utils';
import { AuthUser } from '../../index';
import { KhachHang } from '../../models/init-models';

const routerAccount = express.Router();

routerAccount.get(
    '/me',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let user = await GetCurrentUserData(req) as AuthUser;

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
                username: khachHang.username,
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

export default routerAccount;