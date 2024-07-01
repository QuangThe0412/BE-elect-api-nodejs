import express, { Request, Response } from 'express';
import { Khuyenmai, ChiTietKM } from '../../models/init-models';
import { GetCurrentUser } from '../../utils/index';
import { paths } from '.';

const routerKhuyenMai = express.Router();

//get all
routerKhuyenMai.get(
    '/',
    async (req: Request, res: Response) => {
        try {
            let result: Khuyenmai[] = await Khuyenmai.findAll({
                order: [['IDKhuyenMai', 'DESC']],
            });
            res.status(200).send({
                data: result,
                code: 'GET_ALL_KHUYENMAI_SUCCESS',
                mess: 'Nhận danh sách khuyến mãi thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//create
routerKhuyenMai.post(
    '/',
    async (req: Request, res: Response) => {
        try {
            const khuyenMai = req.body as Khuyenmai;
            khuyenMai.IDKhuyenMai = null;

            const { TenKhuyenMai, IdLoaiKH, TuNgay, DenNgay } = khuyenMai;

            //check exist TenKhuyenMai
            if (!TenKhuyenMai) {
                return res.status(400).send({
                    code: 'NAME_KHUYENMAI_INVALID',
                    mess: 'Tên khuyến mãi không được để trống',
                });
            }

            const getKhuyenMaiByName = await Khuyenmai.findOne({
                where: {
                    TenKhuyenMai: TenKhuyenMai,
                },
            });

            if (getKhuyenMaiByName) {
                return res.status(400).send({
                    code: 'NAME_KHUYENMAI_EXISTED',
                    mess: 'Tên khuyến mãi đã tồn tại',
                });
            }

            if (!TuNgay || !DenNgay) {
                return res.status(400).send({
                    code: 'DATE_INVALID',
                    mess: 'Ngày bắt đầu và ngày kết thúc không được để trống',
                });
            }

            if (TuNgay > DenNgay) {
                return res.status(400).send({
                    code: 'DATE_INVALID',
                    mess: 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc',
                });
            }

            khuyenMai.IdLoaiKH = IdLoaiKH;
            khuyenMai.createBy = await GetCurrentUser(req,null);
            khuyenMai.createDate = new Date();

            const result = await Khuyenmai.create(khuyenMai);

            res.status(201).send({
                data: result,
                code: 'CREATE_KHUYENMAI_SUCCESS',
                mess: 'Tạo khuyến mãi thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//update
routerKhuyenMai.put(
    '/:id',
    async (req: Request, res: Response) => {
        try {
            const { TenKhuyenMai, IdLoaiKH, TuNgay, DenNgay } = req.body as Khuyenmai;
            const id = req.params.id;

            const khuyenMaiUpdate = await Khuyenmai.findByPk(id);
            if (!khuyenMaiUpdate) {
                return res.status(404).send({
                    code: 'KHUYENMAI_NOT_FOUND',
                    mess: 'Không tìm thấy khuyến mãi',
                });
            }

            //check exist TenKhuyenMai
            const getKhuyenMaiByName = await Khuyenmai.findOne({
                where: {
                    TenKhuyenMai: TenKhuyenMai,
                },
            });

            if (getKhuyenMaiByName && getKhuyenMaiByName.IDKhuyenMai !== khuyenMaiUpdate.IDKhuyenMai) {
                return res.status(400).send({
                    code: 'NAME_KHUYENMAI_EXISTED',
                    mess: 'Tên khuyến mãi đã tồn tại',
                });
            }

            if (!TuNgay || !DenNgay) {
                return res.status(400).send({
                    code: 'DATE_INVALID',
                    mess: 'Ngày bắt đầu và ngày kết thúc không được để trống',
                });
            }

            if (TuNgay > DenNgay) {
                return res.status(400).send({
                    code: 'DATE_INVALID',
                    mess: 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc',
                });
            }

            khuyenMaiUpdate.TuNgay = TuNgay;
            khuyenMaiUpdate.DenNgay = DenNgay;
            khuyenMaiUpdate.TenKhuyenMai = TenKhuyenMai;
            khuyenMaiUpdate.IdLoaiKH = IdLoaiKH;
            khuyenMaiUpdate.modifyBy = await GetCurrentUser(req,null);
            khuyenMaiUpdate.modifyDate = new Date();

            await Khuyenmai.update(khuyenMaiUpdate, {
                where: {
                    IDKhuyenMai: id,
                },
            });

            res.status(200).send({
                code: 'UPDATE_KHUYENMAI_SUCCESS',
                mess: 'Cập nhật khuyến mãi thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//delete
routerKhuyenMai.delete(
    '/:id',
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const khuyenMai = await Khuyenmai.findByPk(id);
            if (!khuyenMai) {
                return res.status(404).send({
                    code: 'KHUYENMAI_NOT_FOUND',
                    mess: 'Không tìm thấy khuyến mãi',
                });
            }

            khuyenMai.modifyDate = new Date();
            khuyenMai.modifyBy = await GetCurrentUser(req,null);
            khuyenMai.Deleted = !khuyenMai.Deleted;

            await Khuyenmai.update(khuyenMai, {
                where: {
                    IDKhuyenMai: id,
                },
            });

            res.status(200).send({
                code: 'TOGGLE_KHUYENMAI_SUCCESS',
                mess: 'Bật/Tắt khuyến mãi thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//get details
routerKhuyenMai.get(
    '/:id',
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const khuyenMai = await Khuyenmai.findByPk(id);
            if (!khuyenMai) {
                return res.status(404).send({
                    code: 'KHUYENMAI_NOT_FOUND',
                    mess: 'Không tìm thấy khuyến mãi',
                });
            }

            res.status(200).send({
                data: khuyenMai,
                code: 'GET_KHUYENMAI_SUCCESS',
                mess: 'Nhận khuyến mãi thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//get all details of discount
routerKhuyenMai.get(
    '/:idDiscount' + '/chiTietKhuyenMai',
    async (req: Request, res: Response) => {
        try {
            const { idDiscount } = req.params;
            const khuyenMai = await Khuyenmai.findByPk(idDiscount);
            if (!khuyenMai) {
                return res.status(404).send({
                    code: 'KHUYENMAI_NOT_FOUND',
                    mess: 'Không tìm thấy khuyến mãi',
                });
            }

            const result = await ChiTietKM.findAll({
                where: {
                    IDKhuyenMai: idDiscount,
                },
                order: [['IDChiTietKM', 'DESC']],
            });

            res.status(200).send({
                data: result,
                code: 'GET_KHUYENMAI_DETAILS_SUCCESS',
                mess: 'Nhận chi tiết khuyến mãi thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });


export default routerKhuyenMai;