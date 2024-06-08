import express, { Request, Response } from 'express';
import { ChiTietCongNoKH, CongNoKH } from '../../models/init-models';
import { GetCurrentUser } from '../../utils/index';

const routerChiTietCongNoKH = express.Router();

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

        chiTietCongNoKH.createBy = await GetCurrentUser(req);
        chiTietCongNoKH.createDate = new Date();

        const result = await ChiTietCongNoKH.create(chiTietCongNoKH);

        res.status(200).send({
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

export default routerChiTietCongNoKH;