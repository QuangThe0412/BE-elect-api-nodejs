import express, { NextFunction, Response } from 'express';
import { Op } from 'sequelize';
import schemaValidation from '../../middlewares/schema-validation.middleware';
import { Request } from '../../index';
import userSchema from '../../schemas/user.schema';
import { Admin } from '../../models/init-models';
import { ComparePassword, HashPassword, GetRoles } from '../../utils';
import authService from '../../services/auth.service';
import config from '../../config/config';
import { AuthUser } from '../../index';
console.log({config})
const routerAuth = express.Router();

routerAuth.post(
    '/register',
    schemaValidation(userSchema.register),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let payload = { ...req.body };
            let { username, password, phone } = payload;

            let duplicatedUser = await Admin.findOne({
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
                    message: 'Phone or username was existed',
                });
            }

            let pwdToStore = await HashPassword(username, password);
            // console.log('Password to store :===>', pwdToStore);
            const admin = await Admin.create({
                username,
                password: pwdToStore,
                saler: true,
                Deleted: false,
            });

            const tokens = authService.generateTokens({
                user: {
                    username,
                    userId: admin.id,
                    role: GetRoles(admin),
                },
            });
            return res.status(200).send(tokens);
        } catch (error) {
            next(error);
        }
    }
);

routerAuth.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({
            where: {
                username,
            },
        });
        if (!admin || !(await ComparePassword(username, password, admin.password))) {
            return res.status(400).json({
                code: 'incorrect_password_or_user_name',
                message: 'Incorrect password or user name',
            });
        }

        const authPayload: AuthUser = {
            username: admin.username,
            role: GetRoles(admin),
            userId: admin.id,
        };

        const generatedTokens = authService.generateTokens(
            {
                user: authPayload,
            },
            config.ADMIN_ACCESS_TOKEN_SECRET
        );
        return res.send(generatedTokens);
    } catch (err) {
        res.status(500).send(err);
    }
});

routerAuth.post('/refreshToken', async (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        const response = authService.refreshToken(
            token,
            config.ADMIN_REFRESH_TOKEN_SECRET as string
        );
        res.send(response);
    } catch (err) {
        res.status(500).send(err);
    }
});

export default routerAuth;