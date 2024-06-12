import express, { Request, Response } from 'express';
import { ChiTietPhieuNhap, Mon, PhieuNhap } from '../../models/init-models';
import { GetCurrentUser } from '../../utils/index';

type typeUpdateMon = {
    IdMon: number;
    SoLuongNhap: number;
}

const routerPhieuNhap = express.Router();

//get all
routerPhieuNhap.get('/', async (req: Request, res: Response) => {
    try {
        let result: PhieuNhap[] = await PhieuNhap.findAll({
            order: [['IDPhieuNhap', 'DESC']],
        });

        res.status(200).send({
            data: result,
            code: 'GET_ALL_PHIEUNHAP_SUCCESS',
            mess: 'Nhận danh sách phiếu nhập thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//get by id
routerPhieuNhap.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        let result: PhieuNhap = await PhieuNhap.findOne({
            where: {
                IDPhieuNhap: id,
            }
        });

        if (!result) {
            return res.status(404).send({
                code: 'PHIEUNHAP_NOT_FOUND',
                mess: 'Không tìm thấy phiếu nhập',
            });
        }

        res.status(200).send({
            data: result,
            code: 'GET_PHIEUNHAP_SUCCESS',
            mess: 'Nhận phiếu nhập thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//create
routerPhieuNhap.post('/', async (req: Request, res: Response) => {
    try {
        const phieuNhap = req.body as PhieuNhap;
        phieuNhap.IDPhieuNhap = null;

        phieuNhap.createDate = new Date();
        phieuNhap.createBy = await GetCurrentUser(req);
        const result = await PhieuNhap.create(phieuNhap);

        res.status(201).send({
            data: result,
            code: 'CREATE_PHIEUNHAP_SUCCESS',
            mess: 'Tạo phiếu nhập thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//update
routerPhieuNhap.put(
    '/:id',
    async (req: Request, res: Response) => {
        try {
            const phieuNhap = req.body as PhieuNhap;
            const idPhieuNhap = req.params.id;

            if (!idPhieuNhap) {
                return res.status(400).send({
                    code: 'ID_REQUIRED',
                    mess: 'Thiếu id phiếu nhập',
                });
            }

            phieuNhap.modifyDate = new Date();
            phieuNhap.modifyBy = await GetCurrentUser(req);

            const result = await PhieuNhap.update(phieuNhap, {
                where: {
                    IDPhieuNhap: idPhieuNhap,
                }
            });

            res.status(200).send({
                data: result,
                code: 'UPDATE_PHIEUNHAP_SUCCESS',
                mess: 'Cập nhật phiếu nhập thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//delete
routerPhieuNhap.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const existedPhieuNhap = await PhieuNhap.findOne({
            where: {
                IDPhieuNhap: id,
            }
        });

        if (!existedPhieuNhap) {
            return res.status(404).send({
                code: 'PHIEUNHAP_NOT_FOUND',
                mess: 'Không tìm thấy phiếu nhập',
            });
        }

        await PhieuNhap.update({
            Deleted: true,
            modifyBy: await GetCurrentUser(req),
            modifyDate: new Date(),
        }, {
            where: {
                IDPhieuNhap: id,
            }
        });

        const chiTietPhieuNhap = await ChiTietPhieuNhap.findAll({
            where: {
                IDPhieuNhap: id,
            }
        });

        const arrayIdMon = [] as typeUpdateMon[];
        chiTietPhieuNhap.forEach(async (item) => {
            arrayIdMon.push({
                IdMon: item.IDMon,
                SoLuongNhap: item.SoLuongNhap,
            });
            await ChiTietPhieuNhap.update({
                Deleted: true,
                modifyBy: await GetCurrentUser(req),
                modifyDate: new Date(),
            }, {
                where: {
                    IDChiTietPhieuNhap: item.IDChiTietPhieuNhap,
                }
            });
        });

        if (arrayIdMon.length > 0) {
            const mons: Mon[] = await Mon.findAll({
                where: {
                    IDMon: arrayIdMon.map((item) => item.IdMon),
                }
            });

            mons.forEach(async (item) => {
                const mon = arrayIdMon.find((mon) => mon.IdMon === item.IDMon);
                if (mon) {
                    const soLuong = item.SoLuongTonKho - mon.SoLuongNhap;
                    item.SoLuongTonKho = soLuong < 0 ? 0 : soLuong;
                    await Mon.update(item, {
                        where: {
                            IDMon: item.IDMon,
                        }
                    });
                }
            });
        }

        res.status(200).send({
            code: 'DELETE_PHIEUNHAP_SUCCESS',
            mess: 'Xóa phiếu nhập thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//get all chi tiết phiếu nhập theo id phiếu nhập
routerPhieuNhap.get('/:id/chiTietPhieuNhap', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const result: ChiTietPhieuNhap[] = await ChiTietPhieuNhap.findAll({
            where: {
                IDPhieuNhap: id,
            }
        });

        res.status(200).send({
            data: result,
            code: 'GET_PHIEUNHAP_SUCCESS',
            mess: 'Nhận phiếu nhập thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

export default routerPhieuNhap;