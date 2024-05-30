import express, { Request, Response } from 'express';
import { NguoiDung } from '../../models/init-models';
import { Op } from 'sequelize';
import schemaValidation from '../../middlewares/schema-validation.middleware';
import userSchema from '../../schemas/user.schema';
import { HashPassword, GetRoles } from '../../utils';
import * as jwt from 'jsonwebtoken';
import { AuthUser } from '../../index';
import config from '../../config/config';

type JwtPayload = {
    user: AuthUser;
};

const routerNguoiDung = express.Router();

routerNguoiDung.get('/', async (req: Request, res: Response) => {
    try {
        let result: NguoiDung[] = await NguoiDung.findAll({
            order: [['id', 'DESC']],
        });
        res.status(200).send({
            data: result,
            code: 'GET_ALL_NGUOIDUNG_SUCCESS',
            mess: 'Nhận danh sách người dùng thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

routerNguoiDung.post('/',
    async (req: Request, res: Response) => {
        try {
            let authorization = req.headers.authorization as string;
            let secret = config.ACCESS_TOKEN_SECRET as string;
            const decoded = jwt.verify(authorization, secret) as JwtPayload

            console.log('Decoded: ', decoded);

            let payload = { ...req.body };
            let { username, password, phone, ngaySinh } = payload;

            return res.status(400).json({});
            //////
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

            return res.status(201).send({
                // data: tokens,
                code: 'REGISTER_SUCCESS',
                mess: 'Đăng ký tài khoản thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

routerNguoiDung.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const result = await NguoiDung.findByPk(id);
        if (result) {
            res.status(200).send({
                data: result,
                code: 'GET_NGUOIDUNG_SUCCESS',
                mess: 'Nhận thông tin người dùng thành công',
            });
        } else {
            res.status(404).send({
                code: 'NOT_FOUND',
                mess: 'Không tìm thấy người dùng',
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

routerNguoiDung.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const nguoiDung = req.body as NguoiDung;
        const result = await NguoiDung.update(nguoiDung, {
            where: {
                id: id,
            },
        });
        if (result[0]) {
            res.status(200).send({
                code: 'UPDATE_NGUOIDUNG_SUCCESS',
                mess: 'Cập nhật người dùng thành công',
            });
        } else {
            res.status(404).send({
                code: 'NOT_FOUND',
                mess: 'Không tìm thấy người dùng',
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

export default routerNguoiDung;