import express, { NextFunction, Response } from 'express';
import { Op } from 'sequelize';
import schemaValidation from '../../middlewares/schema-validation.middleware';
import { Request } from '../../index';
import userSchema from '../../schemas/user.schema';
import { ComparePassword, HashPassword, GetRoles } from '../../utils';
import authService from '../../services/auth.service';
import config from '../../config/config';
import { AuthUser } from '../../index';
import { NguoiDung } from '../../models/init-models';

const routerAuth = express.Router();

routerAuth.post(
    '/register',
    schemaValidation(userSchema.register),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let payload = { ...req.body };
            let { username, password, phone, ngaySinh } = payload;

            let duplicatedUser = await NguoiDung.findOne({
                where: {
                    [Op.or]: [
                        { phone },
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
            // console.log('Password to store :===>', pwdToStore);
            const nguoiDung = await NguoiDung.create({
                username,
                password: pwdToStore,
                phone,
                admin: false,
                saler: false,
                cashier: false,
                inventory: false,
                guest: true,
                ngaySinh,
                createDate: new Date(),
                modifyDate: null,
                Deleted: false,
            });

            const tokens = authService.generateTokens({
                user: {
                    username,
                    userId: nguoiDung.id,
                    roles: GetRoles(nguoiDung),
                },
            });
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

routerAuth.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const admin = await NguoiDung.findOne({
            where: {
                username,
            },
        });
        if (!admin || !(await ComparePassword(username, password, admin.password))) {
            return res.status(400).json({
                code: 'incorrect_password_or_user_name',
                mess: 'Mật khẩu hoặc tài khoản không đúng',
            });
        }

        const authPayload: AuthUser = {
            username: admin.username,
            roles: GetRoles(admin),
            userId: admin.id,
        };

        const generatedTokens = authService.generateTokens(
            {
                user: authPayload,
            },
            config.ADMIN_ACCESS_SECRET
        );
        return res.status(200).send({
            data: generatedTokens,
            code: 'LOGIN_SUCCESS',
            mess: 'Đăng nhập thành công',
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

routerAuth.post('/refreshToken', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        const response = authService.refreshToken(
            refreshToken,
            config.ADMIN_ACCESS_SECRET as string
        );

        res.status(200).send({
            data: response,
            code: 'REFRESH_TOKEN_SUCCESS',
            mess: 'Refresh token success',
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

routerAuth.get('/me', async (req: Request, res: Response) => {
    try {
        const { idUser } = req.query;
        console.log('idUser', idUser);
        if (!idUser) {
            return res.status(400).json({
                code: 'missing_user_id',
                mess: 'Missing user id',
            });
        }

        const user = await NguoiDung.findOne({
            where: {
                id: Number(idUser),
            },
        });

        const userResponse = {
            id: user.id,
            username: user.username,
            phone: user.phone,
            admin: user.admin,
            saler: user.saler,
            cashier: user.cashier,
            inventory: user.inventory,
            guest: user.guest,
            ngaySinh: user.ngaySinh,
            createDate: user.createDate,
            modifyDate: user.modifyDate,
            Deleted: user.Deleted,
        };

        res.status(200).send({
            data: userResponse,
            code: 'GET_PROFILE_SUCCESS',
            mess: 'Get profile success',
        });
    } catch (err) {
        res.status(500).send(err);
    }
});


routerAuth.put('/updateProfile', async (req: Request, res: Response) => {
    try {
        const { id, phone, ngaySinh } = req.body;
        if (!id || !phone) {
            return res.status(400).json({
                code: 'missing_user_id_or_phone',
                mess: 'Không tìm thấy id hoặc số điện thoại',
            });
        }

        const user = await NguoiDung.findOne({
            where: {
                id: Number(id),
            },
        });

        if (!user) {
            return res.status(400).json({
                code: 'user_not_found',
                mess: 'Không tìm thấy người dùng',
            });
        }

        // kiem tra so dien thoai da ton tai chua
        if (phone && phone !== user.phone) {
            const userByPhone = await NguoiDung.findOne({
                where: {
                    phone,
                },
            });

            if (userByPhone) {
                return res.status(400).json({
                    code: 'phone_exist',
                    mess: 'Số điện thoại đã đuợc sử dụng',
                });
            }
        }
        user.phone = phone;
        user.ngaySinh = ngaySinh;
        user.modifyDate = new Date();

        await NguoiDung.update(user, { where: { id: user.id } });

        res.status(200).send({
            data: user,
            code: 'UPDATE_PROFILE_SUCCESS',
            mess: 'Update profile success',
        });
    } catch (err) {
        res.status(500).send(err);
    }
});
export default routerAuth;