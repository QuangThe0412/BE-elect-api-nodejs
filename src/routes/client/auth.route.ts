import express, { NextFunction, Response } from 'express';
import { Op } from 'sequelize';
import schemaValidation from '../../middlewares/schema-validation.middleware';
import { Request } from '../../index';
import userSchema from '../../schemas/user.schema';
import { ComparePassword, HashPassword } from '../../utils';
import authService from '../../services/auth.service';
import config from '../../config/config';
import { KhachHang } from '../../models/init-models';

const routerAuth = express.Router();

type AuthRes = {
    accessToken: string;
    refreshToken: string;
    account: any;
}

routerAuth.post(
    '/register',
    schemaValidation(userSchema.register),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let payload = { ...req.body };
            let { name, username, password, phone } = payload;

            let duplicatedUser = await KhachHang.findOne({
                where: {
                    [Op.or]: [
                        { DienThoai: phone },
                        { username },
                    ],
                },
            });
            if (duplicatedUser) {
                return res.status(400).json({
                    code: 'phone_or_username_exist',
                    mess: 'Số điện thoại hoặc tài khoản đã tốn tại',
                });
            }

            let pwdToStore = await HashPassword(username, password,config.ACCESS_TOKEN_SECRET);

            const khachHang = await KhachHang.create({
                IDKhachHang: null,
                username,
                TenKhachHang: name,
                password: pwdToStore,
                DienThoai: phone,
                createDate: new Date(),
                modifyDate: null,
                createBy: 'client',
                modifyBy: null,
                Deleted: false,
            });

            const tokens = authService.generateTokens({
                user: {
                    username,
                    userId: khachHang.IDKhachHang,
                }
            }, config.ACCESS_TOKEN_SECRET as string);

            const result: AuthRes = {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                account: {
                    IDKhachHang: khachHang.IDKhachHang,
                    IDLoaiKH: khachHang.IDLoaiKH,
                    TenKhachHang: name,
                    UserName: username,
                    DienThoai: phone,
                }
            }
            console.log({ result });

            return res.status(201).send({
                data: result,
                code: 'REGISTER_SUCCESS',
                mess: 'Đăng ký tài khoản thành công',
            });
        } catch (error) {
            next(error);
        }
    }
);

routerAuth.post(
    '/login',
    schemaValidation(userSchema.login),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let payload = { ...req.body };
            let { username, password } = payload;

            let user = await KhachHang.findOne({
                where: {
                    username,
                },
            });

            if (!user) {
                return res.status(400).json({
                    code: 'user_not_found',
                    mess: 'Tài khoản hoặc mật khẩu không đúng',
                });
            }

            if (!(await ComparePassword(username, password, user.password,config.ACCESS_TOKEN_SECRET))) {
                return res.status(400).json({
                    code: 'user_not_found',
                    mess: 'Tài khoản hoặc mật khẩu không đúng',
                });
            }

            const tokens = authService.generateTokens({
                user: {
                    username,
                    userId: user.IDKhachHang,
                }
            }, config.ACCESS_TOKEN_SECRET as string);

            const result: AuthRes = {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                account: {
                    IDKhachHang: user.IDKhachHang,
                    IDLoaiKH: user.IDLoaiKH,
                    TenKhachHang: user.TenKhachHang,
                    UserName: user.username,
                    DienThoai: user.DienThoai,
                }
            }

            return res.status(200).send({
                data: result,
                code: 'LOGIN_SUCCESS',
                mess: 'Đăng nhập thành công',
            });
        } catch (error) {
            next(error);
        }
    }
);

routerAuth.post(
    '/refresh-token',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('=============/refresh-token================');
            let payload = { ...req.body };
            let { refreshToken } = payload;

            const tokens = authService.refreshToken(
                refreshToken,
                config.REFRESH_TOKEN_SECRET as string
            );

            return res.status(200).send({
                data: tokens,
                code: 'REFRESH_TOKEN_SUCCESS',
                mess: 'Làm mới token thành công',
            });
        } catch (error) {
            next(error);
        }
    }
);

export default routerAuth;