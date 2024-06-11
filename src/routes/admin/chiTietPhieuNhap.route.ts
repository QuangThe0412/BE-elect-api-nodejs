import express, { Request, Response } from 'express';
import { ChiTietPhieuNhap, PhieuNhap } from '../../models/init-models';
import { GetCurrentUser } from '../../utils/index';

const routerChiTietPhieuNhap = express.Router();

//get all
routerChiTietPhieuNhap.get('/', async (req: Request, res: Response) => {
    try {
        let result: ChiTietPhieuNhap[] = await ChiTietPhieuNhap.findAll({
            order: [['IDChiTietPhieuNhap', 'DESC']],
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
routerChiTietPhieuNhap.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        let result: ChiTietPhieuNhap = await ChiTietPhieuNhap.findOne({
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

//create detail
routerChiTietPhieuNhap.post('/', async (req: Request, res: Response) => {
    try {
        const chiTietPhieuNhap = req.body as ChiTietPhieuNhap;
        chiTietPhieuNhap.IDPhieuNhap = null;

        const { IDPhieuNhap, IDMon, SoLuongNhap, DonGiaNhap, ChietKhau, ThanhTien, } = req.body as ChiTietPhieuNhap;

        chiTietPhieuNhap.createDate = new Date();
        chiTietPhieuNhap.createBy = await GetCurrentUser(req);

        const result = await ChiTietPhieuNhap.create(chiTietPhieuNhap);

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

export default routerChiTietPhieuNhap;