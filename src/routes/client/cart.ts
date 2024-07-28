import express, { Request, Response } from 'express';
import { HoaDon, ChiTietHD, Mon } from '../../models/init-models';
import { GetCurrentUserData, GetDiscount, STATUS_ENUM } from './../../utils/index';
import config from '../../config/config';
import { AuthUser } from '../../index';
import { DiscountResType } from '@schemas/discount.schema';

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

type IdMonAndSoLuongs = {
    IDMon: number;
    SoLuong: number;
}

const routerCart = express.Router();

//get all
routerCart.get(
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

            const cart: CartItem = await HoaDon.findOne({
                order: [['IDHoaDon', 'ASC']],
                where: {
                    IDKhachHang: user.userId,
                    TrangThai: STATUS_ENUM.PENDING,
                },
                attributes: ['IDHoaDon', 'IDKhachHang', 'CongNo', 'TrangThai'],
            });
            
            if (!cart) {
                return res.status(200).send({
                    data: {},
                    code: 'GET_ALL_HOADON_SUCCESS',
                    mess: 'Nhận danh sách hóa đơn thành công',
                });
            }

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

            const body = req.body as CartDetails[];

            if (!body) {
                return res.status(400).json({
                    code: 'bad_request',
                    mess: 'Thiếu thông tin hóa đơn',
                });
            }

            const { id } = req.params;
            const idHoadon = Number(id ?? 0);
            let result;
            if (idHoadon > 0) {
                result = await addItemToHoaDon(user.userId, idHoadon, body);
            } else {
                result = await createNewHoaDon(user.userId, body);
            }

            return res.status(200).send({
                data: result,
                code: 'CREATE_HOADON_SUCCESS',
                mess: 'Tạo hóa đơn thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//update status processing cart
routerCart.put(
    '/processing/:id',
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
            const idHoaDon = Number(id);

            if (!idHoaDon) {
                return res.status(400).json({
                    code: 'bad_request',
                    mess: 'Thiếu thông tin hóa đơn',
                });
            }

            const hoaDon = await HoaDon.findOne({
                where: {
                    IDHoaDon: idHoaDon,
                    IDKhachHang: user.userId,
                },
                attributes: ['IDHoaDon', 'IDKhachHang', 'CongNo', 'TrangThai'],
            });

            if (!hoaDon || hoaDon.TrangThai !== STATUS_ENUM.PENDING) {
                return res.status(400).json({
                    code: 'bad_request',
                    mess: 'Hóa đơn không tồn tại hoặc đã được xử lý',
                });
            }

            await HoaDon.update({
                TrangThai: STATUS_ENUM.PROCESSING,
                createDate: new Date(),
                createBy: user.username,
            }, {
                where: {
                    IDHoaDon: idHoaDon,
                    IDKhachHang: user.userId,
                }
            });

            res.status(200).send({
                code: 'UPDATE_HOADON_SUCCESS',
                mess: 'Cập nhật trạng thái hóa đơn đang xử lý thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//update cart
routerCart.put(
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
            const idChiTietHD = id;
            const body = req.body as CartDetails;
            const { SoLuong } = body;

            if (!id || !body) {
                return res.status(400).json({
                    code: 'bad_request',
                    mess: 'Thiếu thông tin hóa đơn',
                });
            }

            const chiTietHD = await ChiTietHD.findOne({
                where: {
                    IDChiTietHD: idChiTietHD,
                    Deleted: false,
                },
                attributes: ['IDChiTietHD', 'IDHoaDon', 'IDMon', 'SoLuong', 'DonGia', 'ChietKhau', 'TienChuaCK', 'TienCK', 'TienSauCK'],
            });

            if (!chiTietHD) {
                return res.status(400).json({
                    code: 'bad_request',
                    mess: 'Chi tiết hóa đơn không tồn tại',
                });
            }

            const hoaDon = await HoaDon.findOne({
                where: {
                    IDHoaDon: chiTietHD.IDHoaDon,
                    IDKhachHang: user.userId,
                },
                attributes: ['IDHoaDon', 'IDKhachHang', 'CongNo', 'TrangThai'],
            });

            if (!hoaDon || hoaDon.TrangThai !== STATUS_ENUM.PENDING) {
                return res.status(400).json({
                    code: 'bad_request',
                    mess: 'Hóa đơn không tồn tại hoặc đã được xử lý',
                });
            }
            const { IDMon } = chiTietHD;
            const mon = await Mon.findOne({
                where: {
                    IDMon,
                    Deleted: false,
                },
                attributes: ['IDMon', 'DonGiaBanLe'],
            });

            if (!mon) {
                return res.status(400).json({
                    code: 'bad_request',
                    mess: 'Món không tồn tại',
                })
            }

            const chietKhauArr = await GetDiscount(user?.userId, [IDMon]) as DiscountResType[];

            const TienChuaCK = mon.DonGiaBanLe * SoLuong;
            const TienCK = TienChuaCK * chietKhauArr.find((item) => item.IdMon === IDMon)?.PhanTramKM / 100;
            const TienSauCK = TienChuaCK - TienCK;
            await ChiTietHD.update({
                SoLuong,
                DonGia: mon.DonGiaBanLe,
                TienChuaCK,
                TienCK,
                TienSauCK,
                createDate: new Date(),
                createBy: user.username,
            }, {
                where: {
                    IDChiTietHD: idChiTietHD,
                }
            });

            res.status(200).send({
                code: 'UPDATE_HOADON_SUCCESS',
                mess: 'Cập nhật hóa đơn thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//detete cart
routerCart.delete(
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
            const idChiTietHD = id;

            if (!idChiTietHD) {
                return res.status(400).json({
                    code: 'bad_request',
                    mess: 'Thiếu thông tin hóa đơn',
                });
            }

            const chiTietHD = await ChiTietHD.findOne({
                where: {
                    IDChiTietHD: idChiTietHD,
                    Deleted: false,
                },
                attributes: ['IDChiTietHD', 'IDHoaDon', 'IDMon', 'SoLuong', 'DonGia', 'ChietKhau', 'TienChuaCK', 'TienCK', 'TienSauCK'],
            });

            if (!chiTietHD) {
                return res.status(400).json({
                    code: 'bad_request',
                    mess: 'Chi tiết hóa đơn không tồn tại',
                });
            }

            const hoaDon = await HoaDon.findOne({
                where: {
                    IDHoaDon: chiTietHD.IDHoaDon,
                    IDKhachHang: user.userId,
                },
                attributes: ['IDHoaDon', 'IDKhachHang', 'CongNo', 'TrangThai'],
            });

            if (!hoaDon || hoaDon.TrangThai !== STATUS_ENUM.PENDING) {
                return res.status(400).json({
                    code: 'bad_request',
                    mess: 'Hóa đơn không tồn tại hoặc đã được xử lý',
                });
            }

            await ChiTietHD.update({
                Deleted: true,
                createDate: new Date(),
                createBy: user.username,
            }, {
                where: {
                    IDChiTietHD: idChiTietHD,
                    IDMon: chiTietHD.IDMon,
                    Deleted: false,
                }
            });

            res.status(200).send({
                data: {},
                code: 'DELETE_HOADON_SUCCESS',
                mess: 'Hủy hóa đơn thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

const createNewHoaDon = async (userId: number, body: CartDetails[]) => {
    try {
        let result: CartDetails[] = [];
        const newCart = await HoaDon.create({
            IDKhachHang: userId,
            CongNo: 0,
            TrangThai: STATUS_ENUM.PENDING,
        });

        const idMonsAndSoLuong = body.map((item) => {
            return {
                IDMon: item.IDMon,
                SoLuong: item.SoLuong,
            }
        });

        const newCartDetails = await generateCartDetails(userId, newCart.IDHoaDon, idMonsAndSoLuong);

        if (newCartDetails.length > 0) {
            if (newCartDetails.length > 0) {
                const createdRecords = await ChiTietHD.bulkCreate(newCartDetails, { returning: true });
                const records = createdRecords.map((item) => item.dataValues);
                const mons = await Mon.findAll({
                    where: {
                        IDMon: records.map((item) => item.IDMon),
                        Deleted: false,
                    },
                    attributes: ['IDMon', 'TenMon', 'DonGiaBanLe', 'Image'],
                });

                records.map((item) => {
                    const mon = mons.find((mon) => mon.IDMon === item.IDMon);
                    result.push(                        
                        {
                            IDChiTietHD: item.IDChiTietHD,
                            IDHoaDon: item.IDHoaDon,
                            IDMon: item.IDMon,
                            SoLuong: item.SoLuong,
                            DonGia: mon?.DonGiaBanLe,
                            ChietKhau: item.ChietKhau,
                            TienChuaCK: item.TienChuaCK,
                            TienCK: item.TienCK,
                            TienSauCK: item.TienSauCK,
                            Image: mon?.Image,
                            TenMon: mon?.TenMon,
                        }
                    );
                });
                return result;
            }
        }
    } catch (err) {
        console.error(err);
    }
};

const addItemToHoaDon = async (userId: number, idHoaDon: number, body: CartDetails[]) => {
    try {
        let result: CartDetails[] = [];
        const idMonsAndSoLuong = body.map((item) => {
            return {
                IDMon: item?.IDMon,
                SoLuong: item?.SoLuong,
            }
        });

        const chiTietHd = await ChiTietHD.findAll({
            where: {
                IDHoaDon: idHoaDon,
                IDMon: idMonsAndSoLuong.map((item) => item.IDMon),
            },
            attributes: ['IDChiTietHD', 'IDMon', 'SoLuong', 'Deleted'],
        });

        //update soluong existed mon
        if (chiTietHd.length > 0) {
            for (const item of chiTietHd) {
                if (item.Deleted) { // case : món đã tồn tại nhưng bị xóa giờ update lại đúng row đó
                    const index = idMonsAndSoLuong.findIndex((mon) => mon.IDMon === item.IDMon);
                    if (index !== -1) {
                        idMonsAndSoLuong[index].SoLuong = 1;
                        await ChiTietHD.update({ Deleted: false, SoLuong: idMonsAndSoLuong[index].SoLuong },
                            { where: { IDChiTietHD: item.IDChiTietHD } });
                    }
                } else {
                    const index = idMonsAndSoLuong.findIndex((mon) => mon.IDMon === item.IDMon);
                    if (index !== -1) {
                        idMonsAndSoLuong[index].SoLuong += item.SoLuong;
                        await ChiTietHD.update({ SoLuong: idMonsAndSoLuong[index].SoLuong },
                            { where: { IDChiTietHD: item.IDChiTietHD, Deleted: false } });
                    }
                }
            }
            result = await generateCartDetails(userId, idHoaDon, idMonsAndSoLuong);
            return result;
        }

        const exceptIdMons = chiTietHd.map((item) => item.IDMon);
        const _idMonsAndSoLuong = idMonsAndSoLuong.filter((item) => !exceptIdMons.includes(item.IDMon));
        const newCartDetails = await generateCartDetails(userId, idHoaDon, _idMonsAndSoLuong);

        if (newCartDetails.length > 0) {
            const createdRecords = await ChiTietHD.bulkCreate(newCartDetails, { returning: true });
            const records = createdRecords.map((item) => item.dataValues);
            const mons = await Mon.findAll({
                where: {
                    IDMon: records.map((item) => item.IDMon),
                    Deleted: false,
                },
                attributes: ['IDMon', 'TenMon', 'DonGiaBanLe', 'Image'],
            });

            records.map((item) => {
                const mon = mons.find((mon) => mon.IDMon === item.IDMon);
                result.push({
                    IDChiTietHD: item.IDChiTietHD,
                    IDHoaDon: item.IDHoaDon,
                    IDMon: item.IDMon,
                    SoLuong: item.SoLuong,
                    DonGia: mon?.DonGiaBanLe,
                    ChietKhau: item.ChietKhau,
                    TienChuaCK: item.TienChuaCK,
                    TienCK: item.TienCK,
                    TienSauCK: item.TienSauCK,
                    Image: mon?.Image,
                    TenMon: mon?.TenMon,
                });
            });
            return result;
        }
    } catch (err) {
        console.error(err);
    }
};

const generateCartDetails = async (userId: number, idHoaDon: number, data: IdMonAndSoLuongs[]) => {
    try {
        if (data && data.length > 0) {
            const mons = await Mon.findAll({
                where: {
                    IDMon: data.map((item) => item.IDMon),
                    Deleted: false,
                },
                attributes: ['IDMon', 'TenMon', 'DonGiaBanLe', 'Image'],
            });

            const chitietHD = await ChiTietHD.findAll({
                where: {
                    IDHoaDon: idHoaDon,
                    IDMon: data.map((item) => item.IDMon),
                    Deleted: false,
                },
                attributes: ['IDMon', 'IDHoaDon', 'IDChiTietHD'],
            });
            const chietKhauArr = await GetDiscount(userId, data.map((item) => item.IDMon)) as DiscountResType[];

            const result = data.map((item) => {
                const mon = mons.find((mon) => mon.IDMon === item.IDMon);
                const chietKhau = chietKhauArr.find((item) => item.IdMon === item.IdMon)?.PhanTramKM;
                const TienChuaCK = mon?.DonGiaBanLe * item.SoLuong;
                const TienCK = TienChuaCK * chietKhau / 100;
                const TienSauCK = TienChuaCK - TienCK;

                return {
                    IDHoaDon: idHoaDon,
                    IDMon: item.IDMon,
                    SoLuong: item.SoLuong,
                    DonGia: mon?.DonGiaBanLe,
                    ChietKhau: chietKhau,
                    TienChuaCK,
                    TienCK,
                    TienSauCK,
                    Image: mon?.Image,
                    TenMon: mon?.TenMon,
                    IDChiTietHD: chitietHD.find((item) => item.IDMon === item.IDMon)?.IDChiTietHD,
                }
            });

            return result as CartDetails[];
        }
    } catch (err) {
        console.error(err);
    }
};

export default routerCart;