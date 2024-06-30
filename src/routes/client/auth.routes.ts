import express, { NextFunction, Response } from 'express';
import { Op } from 'sequelize';
import schemaValidation from '../../middlewares/schema-validation.middleware';
import { Request } from '../../index';
import userSchema from '../../schemas/user.schema';
import { ComparePassword, HashPassword } from '../../utils';
import authService from '../../services/auth.service';
import config from '../../config/config';
import { AuthUser } from '../../index';
import { KhachHang, NguoiDung } from '../../models/init-models';

const routerAuth = express.Router();

routerAuth.post(
    '/register',
    schemaValidation(userSchema.register),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let payload = { ...req.body };
            let { username, password, phone } = payload;

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

            let pwdToStore = await HashPassword(username, password);

            const khachHang = await KhachHang.create({
                IDKhachHang: null,
                username,
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
            return res.status(201).send({
                data: tokens,
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
                    mess: 'Tài khoản không tồn tại',
                });
            }

            if (!ComparePassword(username, password, user.password)) {
                return res.status(400).json({
                    code: 'wrong_password',
                    mess: 'Sai mật khẩu',
                });
            }

            const tokens = authService.generateTokens({
                user: {
                    username,
                    userId: user.IDKhachHang,
                }
            }, config.ACCESS_TOKEN_SECRET as string);
            return res.status(200).send({
                data: tokens,
                code: 'LOGIN_SUCCESS',
                mess: 'Đăng nhập thành công',
            });
        } catch (error) {
            next(error);
        }
    }
);

routerAuth.get(
    '/me',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let user = GetCurrentUserData(req);
            if (!user) {
                return res.status(401).json({
                    code: 'unauthorized',
                    mess: 'Chưa đăng nhập',
                });
            }

            const khachHang = await KhachHang.findOne({
                where: {
                    IDKhachHang: user.id,
                },
            });

            return res.status(200).send({
                data: user,
                code: 'GET_ME_SUCCESS',
                mess: 'Lấy thông tin người dùng thành công',
            });
        } catch (error) {
            next(error);
        }
    }
);

