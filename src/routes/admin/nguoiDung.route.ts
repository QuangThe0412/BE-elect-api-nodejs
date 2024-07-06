import express, { Request, Response } from 'express';
import { NguoiDung } from '../../models/init-models';
import { GetCurrentUser, HashPassword, IsAdmin } from '../../utils';
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

routerNguoiDung.post('/',
    async (req: Request, res: Response) => {
        try {
            let checkAdmin = await IsAdmin(req, res);
            if (!checkAdmin) {
                return res.status(403).send({
                    code: 'FORBIDDEN',
                    mess: 'Bạn không có quyền tạo người dùng',
                });
            }

            const user = req.body as NguoiDung;
            user.id = null;
            const { username, password, phone } = user;
            if (!username || !password) return res.status(400).send({
                code: 'USERNAME_PASSWORD_REQUIRED',
                mess: 'Username và password không được để trống',
            });

            //check trùng số điện thoại
            if (!phone) {
                return res.status(400).send({
                    code: 'PHONE_REQUIRED',
                    mess: 'Số điện thoại không được để trống',
                });
            } else {
                let duplicatedUserByPhone = await NguoiDung.findOne({
                    where: {
                        phone: user.phone,
                    },
                });

                if (duplicatedUserByPhone) {
                    return res.status(400).json({
                        code: 'phone_exist',
                        mess: 'Số điện thoại đã tốn tại',
                    });
                }
            }

            user.password = await HashPassword(username, password,config.ADMIN_ACCESS_SECRET);
            user.createDate = new Date();
            user.createBy = await GetCurrentUser(req,null);

            const newUser = await NguoiDung.create(user);
            newUser.password = undefined;

            res.status(201).send({
                data: newUser,
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
        result.password = undefined;
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
        let checkAdmin = await IsAdmin(req, res);
        if (!checkAdmin) {
            return res.status(403).send({
                code: 'FORBIDDEN',
                mess: 'Bạn không có quyền sửa thông tin người dùng',
            });
        }

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
            newNguoiDung.password = await HashPassword(nguoiDung.username, newNguoiDung.password,config.ADMIN_ACCESS_SECRET);
        }

        //check trùng số điện thoại
        if (newNguoiDung.phone) {
            let duplicatedUserByPhone = nguoiDung.phone !== newNguoiDung.phone && await NguoiDung.findOne({
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
        newNguoiDung.modifyBy = await GetCurrentUser(req,null);
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

routerNguoiDung.delete('/:id', async (req: Request, res: Response) => {
    try {
        let checkAdmin = await IsAdmin(req, res);
        if (!checkAdmin) {
            return res.status(403).send({
                code: 'FORBIDDEN',
                mess: 'Bạn không có quyền bật/tắt người dùng',
            });
        }

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

        nguoiDung.Deleted = !nguoiDung.Deleted;
        nguoiDung.modifyDate = new Date();
        nguoiDung.modifyBy = await GetCurrentUser(req,null);

        await NguoiDung.update(nguoiDung, {
            where: {
                id: id,
            },
        });
        
        res.status(200).send({
            code: 'TOGGLE_ACTIVE_NGUOIDUNG_SUCCESS',
            mess: 'Bật/Tắt người dùng thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

export default routerNguoiDung;