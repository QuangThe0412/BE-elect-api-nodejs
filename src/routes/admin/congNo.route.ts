import express, { Request, Response } from 'express';
import { CongNoKH } from '../../models/init-models';
import { GetCurrentUser} from '../../utils/index';

const routerCongNoKH = express.Router();

//get all
routerCongNoKH.get('/', async (req: Request, res: Response) => {
    try {
        let result: CongNoKH[] = await CongNoKH.findAll({
            order: [['Id', 'DESC']],
        });

        res.status(200).send({
            data: result,
            code: 'GET_ALL_CONGNO_SUCCESS',
            mess: 'Nhận danh sách công nợ thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//create
routerCongNoKH.post('/', async (req: Request, res: Response) => {
    try {
        const congNoKH = req.body as CongNoKH;
        congNoKH.Id = null;

        const { IDKhachHang, IDHoaDon, CongNoDau } = congNoKH;

        if (!IDKhachHang || !IDHoaDon || !CongNoDau) {
            return res.status(400).send({
                code: 'MISSING_FIELDS',
                mess: 'Thiếu trường bắt buộc',
            });
        }

        const existedCongNoKH = await CongNoKH.findOne({
            where: {
                IDKhachHang: IDKhachHang,
                IDHoaDon: IDHoaDon,
            }
        });

        if (existedCongNoKH) {
            return res.status(400).send({
                code: 'CONGNO_EXISTED',
                mess: 'Công nợ đã tồn tại',
            });
        }

        congNoKH.createBy = await GetCurrentUser(req);
        congNoKH.createDate = new Date();
        const newCongNoKH = await CongNoKH.create(congNoKH);

        res.status(201).send({
            data: newCongNoKH,
            code: 'CREATE_CONGNO_SUCCESS',
            mess: 'Tạo công nợ thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//update
routerCongNoKH.put('/', async (req: Request, res: Response) => {
    try {
        const congNoKH = req.body as CongNoKH;
        const { Id, IDKhachHang, IDHoaDon, CongNoDau } = congNoKH;

        if (!Id || !IDKhachHang || !IDHoaDon || !CongNoDau) {
            return res.status(400).send({
                code: 'MISSING_FIELDS',
                mess: 'Thiếu trường bắt buộc',
            });
        }

        const existedCongNoKH = await CongNoKH.findOne({
            where: {
                IDKhachHang: IDKhachHang,
                IDHoaDon: IDHoaDon,
            }
        });

        if (!existedCongNoKH) {
            return res.status(404).send({
                code: 'CONGNO_NOT_FOUND',
                mess: 'Không tìm thấy công nợ',
            });
        }

        congNoKH.modifyBy = await GetCurrentUser(req);
        congNoKH.modifyDate = new Date();
        const updatedCongNoKH = await CongNoKH.update(congNoKH, {
            where: {
                IDKhachHang: IDKhachHang,
                IDHoaDon: IDHoaDon,
            }
        });

        res.status(200).send({
            data: updatedCongNoKH,
            code: 'UPDATE_CONGNO_SUCCESS',
            mess: 'Cập nhật công nợ thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

//get all chi tiết công nợ theo id cong no
routerCongNoKH.get('/:idCongNo' + '/chiTietCongNo', async (req: Request, res: Response) => {
    try {
        const idCongNo = req.params.idCongNo;
        let result: any = await CongNoKH.findAll({
            where: {
                Id: idCongNo,
            },
            order: [['Id', 'DESC']],
        });

        res.status(200).send({
            data: result,
            code: 'GET_ALL_CONGNO_SUCCESS',
            mess: 'Nhận danh sách công nợ thành công',
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

export default routerCongNoKH;