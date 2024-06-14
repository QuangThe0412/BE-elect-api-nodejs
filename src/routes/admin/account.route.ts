import express, { Response } from 'express';
import { Request } from '../../index';
import { ComparePassword, HashPassword, GetRoles, GetCurrentUser, IsAdmin } from '../../utils';
import { NguoiDung } from '../../models/init-models';

const routerAccount = express.Router();

routerAccount.get('/me', async (req: Request, res: Response) => {
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
            mess: 'Nhận thông tin tài khoản thành công',
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

routerAccount.put('/updateProfile', async (req: Request, res: Response) => {
    try {
        const { id, ngaySinh, phone } = req.body;
        if (!id) {
            return res.status(400).json({
                code: 'missing_user_id',
                mess: 'Không tìm thấy id',
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
            // check admin for update phone
            let checkAdmin = await IsAdmin(req, res);
            if (!checkAdmin) {
                return res.status(403).send({
                    code: 'FORBIDDEN',
                    mess: 'Bạn không có quyền sửa số điện thoại người dùng',
                });
            }

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
        user.modifyBy = await GetCurrentUser(req);

        await NguoiDung.update(user, { where: { id: user.id } });

        res.status(200).send({
            data: user,
            code: 'UPDATE_PROFILE_SUCCESS',
            mess: 'Cập nhật thông tin tài khoản thành công',
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

routerAccount.put('/changePassword', async (req: Request, res: Response) => {
    try {
        const { idUser, oldPassword, newPassword } = req.body;
        if (!idUser || !oldPassword || !newPassword) {
            return res.status(400).json({
                code: 'missing_idUser_or_password',
                mess: 'Không tìm thấy idUser hoặc mật khẩu',
            });
        }

        const user = await NguoiDung.findOne({
            where: {
                id: Number(idUser),
            },
        });

        if (!user) {
            return res.status(400).json({
                code: 'user_not_found',
                mess: 'Không tìm thấy người dùng',
            });
        }

        if (!(await ComparePassword(user.username, oldPassword, user.password))) {
            return res.status(400).json({
                code: 'incorrect_old_password',
                mess: 'Mật khẩu hiện tại không đúng',
            });
        }

        const newPwd = await HashPassword(user.username, newPassword);
        user.password = newPwd;
        user.modifyDate = new Date();
        user.modifyBy = await GetCurrentUser(req);

        await NguoiDung.update(user, { where: { id: user.id } });

        res.status(200).send({
            data: user,
            code: 'CHANGE_PASSWORD_SUCCESS',
            mess: 'Đổi mật khẩu thành công',
        });
    } catch (err) {
        res.status(500).send(err);
    }
});

export default routerAccount;