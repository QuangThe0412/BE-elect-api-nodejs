import express, { Request, Response } from 'express';
import { ChiTietPhieuNhap, PhieuNhap } from '../../models/init-models';
import { GetCurrentUser } from '../../utils/index';

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

export default routerPhieuNhap;