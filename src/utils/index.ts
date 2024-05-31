import bcrypt from 'bcrypt';
import config from '../config/config';
import { NguoiDung } from '@models/NguoiDung';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '@services/auth.service';

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

export const HashPassword = async (userName: string, password: string) => {
    const saltRounds = 10;

    try {
        const hash = await bcrypt.hash(password + userName + config.ADMIN_ACCESS_SECRET, saltRounds);
        return hash;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const ComparePassword = async (userName: string, password: string, hash: string) => {
    try {
        const match = await bcrypt.compare(password + userName + config.ADMIN_ACCESS_SECRET, hash);
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
    try {
        //check người dùng có phải admin không
        let authorization = req.headers.authorization as string;
        let secret = config.ACCESS_TOKEN_SECRET as string;
        const decoded = jwt.verify(authorization, secret) as JwtPayload

        if (!decoded || !decoded.user || !decoded.user.roles
            || !Array.isArray(decoded.user.roles)
            || !decoded.user.roles.some((role) => role === RoleEnum.ADMIN)) {
            return res.status(403).json({
                code: 'FORBIDDEN',
                mess: 'Bạn không có quyền sửa thông tin người dùng',
            });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send(err);
    }
};

export const GetCurrentUser = async (req: Request) => {
    try {
        let authorization = req.headers.authorization as string;
        let secret = config.ACCESS_TOKEN_SECRET as string;
        const decoded = jwt.verify(authorization, secret) as JwtPayload

        return decoded?.user?.username;
    } catch (err) {
        console.error(err);
        return null;
    }
}