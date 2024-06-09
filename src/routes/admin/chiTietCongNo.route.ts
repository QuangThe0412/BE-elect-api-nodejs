import express, { Request, Response } from 'express';
import { ChiTietCongNoKH, CongNoKH } from '../../models/init-models';
import { GetCurrentUser } from '../../utils/index';

const routerChiTietCongNoKH = express.Router();

//get all
routerChiTietCongNoKH.get('/', async (req: Request, res: Response) => {
    try {
        let result: ChiTietCongNoKH[] = await ChiTietCongNoKH.findAll({
            order: [['idChiTietCongNoKH', 'DESC']],
        });

        res.status(200).send({
            data: result,
            code: 'GET_ALL_CHITIETCONGNO_SUCCESS',
            mess: 'Nhận danh sách chi tiết công nợ thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//create
routerChiTietCongNoKH.post('/', async (req: Request, res: Response) => {
    try {
        const chiTietCongNoKH = req.body as ChiTietCongNoKH;
        chiTietCongNoKH.idChiTietCongNoKH = null;

        const { idCongNoKH, SoTienTra } = chiTietCongNoKH;

        if (!idCongNoKH || !SoTienTra) {
            return res.status(400).send({
                code: 'MISSING_FIELDS',
                mess: 'Thiếu trường bắt buộc',
            });
        }

        const congNo = await CongNoKH.findOne({
            where: {
                Id: idCongNoKH,
            }
        });

        if (!congNo) {
            return res.status(400).send({
                code: 'CONGNO_NOT_FOUND',
                mess: 'Không tìm thấy công nợ',
            });
        }

        const totalSoTienTra = await totalSoTienDaTra(idCongNoKH, null);
        const moneyCheck = Number(totalSoTienTra) + Number(SoTienTra);
        if (Number(congNo.CongNoDau) < Number(moneyCheck)) {
            return res.status(400).send({
                code: 'SOTIENTRA_INVALID',
                mess: 'Số tiền trả vượt quá số tiền còn lại trong công nợ',
            })
        }

        chiTietCongNoKH.createBy = await GetCurrentUser(req);
        chiTietCongNoKH.createDate = new Date();

        const result = await ChiTietCongNoKH.create(chiTietCongNoKH);

        res.status(201).send({
            data: result,
            code: 'CREATE_CHITIETCONGNO_SUCCESS',
            mess: 'Tạo chi tiết công nợ thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//update
routerChiTietCongNoKH.put(
    '/:id',
    async (req: Request, res: Response) => {
        try {
            const chiTietCongNoKH = req.body as ChiTietCongNoKH;
            const idChiTietCongNoKH = req.params.id;

            const { idCongNoKH, SoTienTra } = chiTietCongNoKH;

            if (!idChiTietCongNoKH) {
                return res.status(400).send({
                    code: 'ID_REQUIRED',
                    mess: 'Thiếu id chi tiết công nợ',
                });
            }

            if (!idCongNoKH || !SoTienTra) {
                return res.status(400).send({
                    code: 'MISSING_FIELDS',
                    mess: 'Thiếu trường bắt buộc',
                });
            }

            const existedChiTietCongNoKH = await ChiTietCongNoKH.findOne({
                where: {
                    idChiTietCongNoKH: idChiTietCongNoKH,
                }
            });

            if (!existedChiTietCongNoKH) {
                return res.status(404).send({
                    code: 'CHITIETCONGNO_NOT_FOUND',
                    mess: 'Không tìm thấy chi tiết công nợ',
                });
            }

            const congNo = await CongNoKH.findOne({
                where: {
                    Id: idCongNoKH,
                }
            });

            if (!congNo) {
                return res.status(400).send({
                    code: 'CONGNO_NOT_FOUND',
                    mess: 'Không tìm thấy công nợ',
                });
            }

            const totalSoTienTra = await totalSoTienDaTra(idCongNoKH, Number(idChiTietCongNoKH));
            const moneyCheck = Number(totalSoTienTra) + Number(SoTienTra);
            if (Number(congNo.CongNoDau) < Number(moneyCheck)) {
                return res.status(400).send({
                    code: 'SOTIENTRA_INVALID',
                    mess: 'Số tiền trả vượt quá số tiền còn lại trong công nợ',
                })
            }

            chiTietCongNoKH.SoTienTra = SoTienTra;
            chiTietCongNoKH.modifyBy = await GetCurrentUser(req);
            chiTietCongNoKH.modifyDate = new Date();

            const result = await ChiTietCongNoKH.update(chiTietCongNoKH, {
                where: {
                    idChiTietCongNoKH: idChiTietCongNoKH,
                }
            });

            res.status(200).send({
                data: result,
                code: 'UPDATE_CHITIETCONGNO_SUCCESS',
                mess: 'Cập nhật chi tiết công nợ thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//delete
routerChiTietCongNoKH.delete('/:id', async (req: Request, res: Response) => {
    try {
        const idChiTietCongNoKH = req.params.id;

        if (!idChiTietCongNoKH) {
            return res.status(400).send({
                code: 'ID_REQUIRED',
                mess: 'Thiếu id chi tiết công nợ',
            });
        }

        const existedChiTietCongNoKH = await ChiTietCongNoKH.findOne({
            where: {
                idChiTietCongNoKH: idChiTietCongNoKH,
            }
        });

        if (!existedChiTietCongNoKH) {
            return res.status(404).send({
                code: 'CHITIETCONGNO_NOT_FOUND',
                mess: 'Không tìm thấy chi tiết công nợ',
            });
        }

        const result = await ChiTietCongNoKH.update({
            Deleted: true,
            modifyBy: await GetCurrentUser(req),
            modifyDate: new Date(),
        }, {
            where: {
                idChiTietCongNoKH: idChiTietCongNoKH,
            }
        });

        res.status(200).send({
            data: result,
            code: 'DELETE_CHITIETCONGNO_SUCCESS',
            mess: 'Xóa chi tiết công nợ thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

const totalSoTienDaTra = async (idCongNoKhachHang: number, exceptId: number | null) => {
    const result = await ChiTietCongNoKH.findAll({
        where: {
            idCongNoKH: idCongNoKhachHang,
        }
    });

    const _result = result.filter(item => item.Deleted === false);

    if (exceptId) {
        return _result.reduce((total, item) => {
            if (item.idChiTietCongNoKH !== exceptId) {
                return total + item.SoTienTra;
            }
            return total;
        }, 0);
    }

    return _result.reduce((total, item) => total + item.SoTienTra, 0);
};

export default routerChiTietCongNoKH;