import express, { Request, Response } from 'express';
import { HoaDon, ChiTietHD, Mon } from '../../models/init-models';
import { GetCurrentUserData, STATUS_ENUM } from './../../utils/index';
import config from '../../config/config';
import { AuthUser } from '../../index';

type CartItem = {
    IDHoaDon?: number;
    IDKhachHang?: number;
    CongNo?: number;
    TrangThai?: number;
}

type CartDetails = {
    IDChiTietHD?: number;
    IDHoaDon?: number;
    IDMon?: number;
    TenMon?: string;
    SoLuong?: number;
    DonGia?: number;
    ChietKhau?: number;
    TienChuaCK?: number;
    TienCK?: number;
    Image?: string;
    TienSauCK?: number;
    Deleted?: boolean;
}

const routerCart = express.Router();

//get all
routerCart.get(
    '/',
    async (req: Request, res: Response) => {
        try {
            let user = await GetCurrentUserData(req, config.ACCESS_TOKEN_SECRET) as AuthUser;
            console.log({ user });
            if (!user) {
                return res.status(401).json({
                    code: 'unauthorized',
                    mess: 'Chưa đăng nhập',
                });
            }

            const cart: CartItem = await HoaDon.findOne({
                order: [['IDHoaDon', 'ASC']],
                where: {
                    IDKhachHang: user.userId,
                    TrangThai: STATUS_ENUM.PENDING,
                },
                attributes: ['IDHoaDon', 'IDKhachHang', 'CongNo', 'TrangThai'],
            });

            const cartDetails: CartDetails[] = await ChiTietHD.findAll({
                where: {
                    IDHoaDon: cart.IDHoaDon,
                    Deleted: false,
                },
                attributes: ['IDChiTietHD', 'IDHoaDon', 'IDMon', 'SoLuong', 'DonGia', 'ChietKhau', 'TienChuaCK', 'TienCK', 'TienSauCK'],
            });

            const monIds = cartDetails.map((item) => item.IDMon);
            const mons = await Mon.findAll({
                where: {
                    IDMon: monIds,
                },
                attributes: ['IDMon', 'TenMon', 'Image'],
            });

            cartDetails.forEach((item) => {
                const mon = mons.find((mon) => mon.IDMon === item.IDMon);
                item.TenMon = mon?.TenMon;
                item.Image = mon?.Image;
            });

            const result = {
                IDHoaDon: cart.IDHoaDon,
                IDKhachHang: cart.IDKhachHang,
                CongNo: cart.CongNo,
                TrangThai: cart.TrangThai,
                details: cartDetails,
            }

            res.status(200).send({
                data: result,
                code: 'GET_ALL_HOADON_SUCCESS',
                mess: 'Nhận danh sách hóa đơn thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//get details
routerCart.get(
    '/:id',
    async (req: Request, res: Response) => {
        try {
            let user = await GetCurrentUserData(req, config.ACCESS_TOKEN_SECRET) as AuthUser;

            if (!user) {
                return res.status(401).json({
                    code: 'unauthorized',
                    mess: 'Chưa đăng nhập',
                });
            }
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    code: 'bad_request',
                    mess: 'Thiếu thông tin ID hóa đơn',
                });
            }

            const hoaDon = await HoaDon.findOne({
                where: {
                    IDHoaDon: id,
                    IDKhachHang: user.userId,
                },
                attributes: ['IDHoaDon', 'IDKhachHang', 'CongNo', 'TrangThai'],
            });

            const chiTietHD = await ChiTietHD.findAll({
                where: {
                    IDHoaDon: id,
                    Deleted: false,
                },
                attributes: ['IDChiTietHD', 'IDHoaDon', 'IDMon', 'SoLuong', 'DonGia', 'ChietKhau', 'TienChuaCK', 'TienCK', 'TienSauCK'],
            });

            const result = {
                IDHoaDon: hoaDon.IDHoaDon,
                IDKhachHang: hoaDon.IDKhachHang,
                CongNo: hoaDon.CongNo,
                TrangThai: hoaDon.TrangThai,
                details: chiTietHD,
            }

            res.status(200).send({
                data: result,
                code: 'GET_HOADON_SUCCESS',
                mess: 'Nhận thông tin hóa đơn thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//create cart
routerCart.post(
    '/',
    async (req: Request, res: Response) => {
        try {
            let user = await GetCurrentUserData(req, config.ACCESS_TOKEN_SECRET) as AuthUser;

            if (!user) {
                return res.status(401).json({
                    code: 'unauthorized',
                    mess: 'Chưa đăng nhập',
                });
            }

            const body = req.body as CartDetails[];

            if (!body) {
                return res.status(400).json({
                    code: 'bad_request',
                    mess: 'Thiếu thông tin hóa đơn',
                });
            }

            const checkHoaDon = await HoaDon.findOne({
                where: {
                    IDKhachHang: user.userId,
                    TrangThai: STATUS_ENUM.PENDING,
                }
            });

            if (checkHoaDon) {
                return res.status(400).json({
                    code: 'bad_request',
                    mess: 'Vui lòng đợi hóa đơn hiện tại được xử lý xong',
                })
            }

            const newCart = await HoaDon.create({
                IDKhachHang: user.userId,
                CongNo: 0,
                TrangThai: STATUS_ENUM.PENDING,
            });

            const newCartDetails = body.map((item) => {
                return {
                    IDHoaDon: newCart.IDHoaDon,
                    IDMon: item.IDMon,
                    SoLuong: item.SoLuong,
                    DonGia: item.DonGia,
                    ChietKhau: item.ChietKhau,
                    TienChuaCK: item.TienChuaCK,
                    TienCK: item.TienCK,
                    TienSauCK: item.TienSauCK,
                }
            });

            await ChiTietHD.bulkCreate(newCartDetails);

            res.status(201).send({
                data: newCart,
                code: 'CREATE_HOADON_SUCCESS',
                mess: 'Tạo hóa đơn thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });


export default routerCart;