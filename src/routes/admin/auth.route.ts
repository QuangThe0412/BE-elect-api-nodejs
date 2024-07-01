import express, { NextFunction, Response } from 'express';
import { Op } from 'sequelize';
import schemaValidation from '../../middlewares/schema-validation.middleware';
import { Request } from '../../index';
import userSchema from '../../schemas/user.schema';
import { ComparePassword, HashPassword, GetRoles, GetCurrentUser } from '../../utils';
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
                id: null,
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
                createBy: await GetCurrentUser(req,null),
                modifyDate: null,
                Deleted: false,
            });

            const tokens = authService.generateTokens({
                user: {
                    username,
                    userId: nguoiDung.id,
                    roles: GetRoles(nguoiDung),
                },
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

routerAuth.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const nguoidDung = await NguoiDung.findOne({
            where: {
                username,
            },
        });

        if (nguoidDung.Deleted) {
            return res.status(400).json({
                code: 'account_deleted',
                mess: 'Tài khoản đã bị khóa vui lòng liện hệ admin để biết thêm chi tiết',
            });
        }

        if (!nguoidDung || !(await ComparePassword(username, password, nguoidDung.password))) {
            return res.status(400).json({
                code: 'incorrect_password_or_user_name',
                mess: 'Mật khẩu hoặc tài khoản không đúng',
            });
        }

        const authPayload: AuthUser = {
            username: nguoidDung.username,
            roles: GetRoles(nguoidDung),
            userId: nguoidDung.id,
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
            mess: 'Đổi mới token thành công',
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

export default routerAuth;