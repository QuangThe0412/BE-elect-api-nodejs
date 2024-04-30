import express, { NextFunction, Response } from 'express';
import crypto from 'crypto';
import { Op } from 'sequelize';
import schemaValidation from '../../middlewares/schema-validation.middleware';
import router from ".";
import { Request } from '../../index';
import userSchema from '../../schemas/user.schema';

router.post(
    '/register',
    schemaValidation(userSchema.register),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let payload = { ...req.body };
            let pwdToStore = payload.userName + payload.password;

            // Hashing pwd string to sha256
            pwdToStore = crypto
                .createHash('md5')
                .update(pwdToStore)
                .digest('hex');
            pwdToStore = '0x' + pwdToStore;
            let duplicatedUser = await Admin.findOne({
                where: {
                    [Op.or]: [
                        { email: payload.email },
                        { name: payload.userName },
                    ],
                },
            });
            if (duplicatedUser) {
                return res.status(400).json({
                    code: 'email_or_username_exist',
                    message: 'Email or username was existed',
                });
            }
            // console.log('Password to store', pwdToStore);
            const admin = await Admin.create({
                name: payload.userName,
                password: pwdToStore,
            });
            const tokens = authService.generateTokens({
                user: {
                    userName: payload.userName,
                    userId: admin.id,
                    role: USER_ROLES.ADMIN_USER,
                },
            });
            return res.status(200).send(tokens);
        } catch (error) {
            next(error);
        }
    }
);