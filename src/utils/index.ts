import { DiscountResType } from './../schemas/discount.schema';
import bcrypt from 'bcrypt';
import config from '../config/config';
import { NguoiDung } from '@models/NguoiDung';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '@services/auth.service';
import { Op } from 'sequelize';
import { ChiTietKM, KhachHang, Khuyenmai, Mon, ThongTin, ThongTinMon } from '../models/init-models';
import slugify from 'slugify';

export const MergeWithOldData = (oldData: any, newData: any) => {
    for (let key in newData) {
        if (typeof newData[key] === 'string') {
            newData[key] = newData[key].trim();
        }
        if (newData[key] === null || newData[key] === '' || newData[key] === 0) {
            newData[key] = oldData[key];
        }
    }
    return newData;
}

export const HashPassword = async (userName: string, password: string, serect: string = config.ACCESS_TOKEN_SECRET) => {
    const saltRounds = 10;

    try {
        const hash = await bcrypt.hash(password + userName + serect, saltRounds);
        return hash;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const ComparePassword = async (
    userName: string, password: string, hash: string,
    serect: string = config.ACCESS_TOKEN_SECRET) => {
    try {
        const match = await bcrypt.compare(password + userName + serect, hash);
        return match;
    } catch (err) {
        console.error(err);
        return false;
    }
};

export const RoleEnum = {
    'ADMIN': 'ADMIN',
    'CASHIER': 'CASHIER',
    'SALER': 'SALER',
    'INVENTORY': 'INVENTORY',
    'GUEST': 'GUEST'
};

export const GetRoles = (nguoiDung: NguoiDung) => {
    const roles = [];
    if (nguoiDung.admin) {
        roles.push(RoleEnum.ADMIN);
    }
    if (nguoiDung.cashier) {
        roles.push(RoleEnum.CASHIER);
    }
    if (nguoiDung.saler) {
        roles.push(RoleEnum.SALER);
    }
    if (nguoiDung.inventory) {
        roles.push(RoleEnum.INVENTORY);
    }
    if (nguoiDung.guest) {
        roles.push(RoleEnum.GUEST);
    }
    return roles;
}

export const IsAdmin = async (req: Request, res: Response) => {
    let result = true;
    try {
        //check người dùng có phải admin không
        let authorization = req.headers.authorization as string;
        let secret = config.ACCESS_TOKEN_SECRET as string;
        const decoded = jwt.verify(authorization, secret) as JwtPayload

        if (!decoded || !decoded.user || !decoded.user.roles
            || !Array.isArray(decoded.user.roles)
            || !decoded.user.roles.some((role) => role === RoleEnum.ADMIN)) {
            result = false;
        }
    } catch (err) {
        result = false;
        console.error(err);
    }
    return result;
};

export const GetCurrentUser = async (req: Request, serect: string) => {
    try {
        let authorization = req.headers.authorization as string;
        let secret = serect ?? config.ADMIN_ACCESS_SECRET as string;
        const decoded = jwt.verify(authorization, secret) as JwtPayload

        return decoded?.user?.username;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export const GetCurrentUserData = async (req: Request, serect: string = config.ADMIN_ACCESS_SECRET) => {
    try {
        let authorization = req.headers.authorization as string;
        const decoded = jwt.verify(authorization, serect) as JwtPayload
        return decoded?.user;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export enum STATUS_ENUM {
    PENDING = 0,
    FINISH = 1,
    CANCEL = 2,
    PROCESSING = 3
}

export const IsPendingStatus = (status: number) => {
    return status === STATUS_ENUM.PENDING;
};

export const GetDiscount = async (idUser: number, idMons: number[]) => {
    const result: DiscountResType[] = idMons.map(idMon => {
        return {
            IdMon: idMon,
            PhanTramKM: 0
        };
    });

    const nguoiDung = await KhachHang.findOne({
        where: {
            IDKhachHang: idUser,
            Deleted: false
        },
        attributes: ['IDLoaiKH', 'IDKhachHang']

    });


    if (!nguoiDung) {
        return result;
    }

    const khuyenMais = await Khuyenmai.findAll(
        {
            where: {
                IdLoaiKH: nguoiDung.IDLoaiKH,
                DenNgay: {
                    [Op.gte]: new Date()
                },
                Deleted: false
            }
        }
    );

    if (!khuyenMais || khuyenMais.length === 0) {
        return result;
    }

    const chiTietKM = await ChiTietKM.findAll({
        where: {
            IDKhuyenMai: khuyenMais.map(km => km.IDKhuyenMai),
            IDMon: {
                [Op.in]: idMons
            },
            Deleted: false
        },
        attributes: ['PhanTramKM', 'IDMon']
    });

    if (!chiTietKM || chiTietKM.length === 0) {
        return result;
    }

    return chiTietKM.map(ct => {
        const discount = result.find(r => r.IdMon === ct.IDMon);
        if (discount) {
            discount.PhanTramKM = ct.PhanTramKM;
        }
    })
}

export const slugifyHandle = (str: string) => {
    if (!str) return '';
    return slugify(str, {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true,      // convert to lower case, defaults to `false`
        strict: false,     // strip special characters except replacement, defaults to `false`
        locale: 'vi',      // language code of the locale to use
        trim: true         // trim leading and trailing replacement chars, defaults to `true`
    })
}

export const getThongTinMon = async (arrayMon: Mon[]) => {
    const idMons = arrayMon.map((item) => item.IDMon);

    const _thongTinMon = await ThongTinMon.findAll({
        where: {
            IdMon: idMons,
            Deleted: false
        }
    });
    const _thongTin = await ThongTin.findAll();

    const _result = arrayMon.map((item: any) => {
        const thongTinMon: ThongTinMon[] = _thongTinMon.filter((x: ThongTinMon) => x.IdMon === item.IDMon);
        return {
            ...item,
            ThongTinMon: thongTinMon.map((data) => {
                const thongTin = _thongTin.find((x: ThongTin) => x.Id === data.IdThongTin);
                const { Id, IdThongTin, IdMon, DonGiaBanSi, DonGiaBanLe, DonGiaVon } = data;
                return {
                    Id,
                    IdThongTin,
                    IdMon,
                    DonGiaBanSi,
                    DonGiaBanLe,
                    DonGiaVon,
                    size: thongTin?.Size || '',
                    color: thongTin?.Color || '',
                }
            })
        }
    });

    return _result;
}