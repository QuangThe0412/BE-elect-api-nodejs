import express, { Request, Response } from 'express';
import { NguoiDung } from '../../models/init-models';
import { Op } from 'sequelize';
import schemaValidation from '../../middlewares/schema-validation.middleware';
import userSchema from '../../schemas/user.schema';
import { HashPassword, GetRoles, RoleEnum, IsAdmin } from '../../utils';
import { AuthUser } from '../../index';
import config from '../../config/config';

const routerNguoiDung = express.Router();

routerNguoiDung.get('/', async (req: Request, res: Response) => {
    try {
        let result: NguoiDung[] = await NguoiDung.findAll({
            order: [['id', 'DESC']],
        });

        result = result.map((item) => {
            item.password = undefined;
            return item;
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

routerNguoiDung.post('/', //--------------------- not OK
    async (req: Request, res: Response) => {
        try {
            let checkAdmin = await IsAdmin(req, res);
            if (checkAdmin) return checkAdmin;

            const { username, password, phone, ngaySinh } = req.body as NguoiDung;

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

            return res.status(201).send({
                // data: tokens,
                code: 'CREATE_USER_SUCCESS',
                mess: 'Tạo user thành công',
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

routerNguoiDung.put('/:id', async (req: Request, res: Response) => { ////////////////--- not OK
    try {
        let checkAdmin = await IsAdmin(req, res);
        if (checkAdmin) return checkAdmin;

        const id = req.params.id;
        if (!id) return res.status(400).send({
            code: 'ID_REQUIRED',
            mess: 'ID không được để trống',
        });

        const nguoiDung = await NguoiDung.findByPk(id);
        if (!nguoiDung) return res.status(404).send({
            code: 'NOT_FOUND',
            mess: 'Không tìm thấy người dùng',
        });

        const newNguoiDung = req.body as NguoiDung;
        if (newNguoiDung.password) {
            newNguoiDung.password = await HashPassword(nguoiDung.username, newNguoiDung.password);
        }

        //check trùng số điện thoại
        if (newNguoiDung.phone) {
            let duplicatedUserByPhone =  nguoiDung.phone !== newNguoiDung.phone && await NguoiDung.findOne({
                where: {
                    phone: newNguoiDung.phone,
                },
            });

            if (duplicatedUserByPhone) {
                return res.status(400).json({
                    code: 'phone_exist',
                    mess: 'Số điện thoại đã tốn tại',
                });
            }
        }
        newNguoiDung.username = nguoiDung.username;
        newNguoiDung.modifyDate = new Date();
        const result = await NguoiDung.update(newNguoiDung, {
            where: {
                id: id,
            },
        });

        if (!result) return res.status(404).send({
            code: 'NOT_FOUND',
            mess: 'Không tìm thấy người dùng',
        });

        res.status(200).send({
            code: 'UPDATE_NGUOIDUNG_SUCCESS',
            mess: 'Cập nhật người dùng thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

export default routerNguoiDung;