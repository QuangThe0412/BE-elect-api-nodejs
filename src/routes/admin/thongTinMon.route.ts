import express from 'express';
import { ThongTinMon } from '../../models/init-models';
import { GetCurrentUser } from '../../utils';

const routerThongTinMon = express.Router();

//delete thong tin mon
routerThongTinMon.delete(
    '/:id',
    async (req, res) => {
        try {
            const currentUser = await GetCurrentUser(req, null);
            const id = req.params.id;
            const thongTinMon = await ThongTinMon.findByPk(id);
            if (thongTinMon == null) {
                return res.status(404).send({
                    code: 'THONGTINMON_NOT_FOUND',
                    mess: 'Không tìm thấy thông tin món',
                });
            }

            thongTinMon.Deleted = !thongTinMon.Deleted;
            thongTinMon.modifyDate = new Date();
            thongTinMon.modifyBy = currentUser;
            await ThongTinMon.update(thongTinMon, {
                where: {
                    Id: id,
                },
            });

            res.status(200).send({
                data: thongTinMon,
                code: 'TOGGLE_ACTIVE_THONGTINMON_SUCCESS',
                mess: 'Bật/Tắt thông tin món thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

export default routerThongTinMon;