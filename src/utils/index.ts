import bcrypt from 'bcrypt';
import config from '../config/config';
import { NguoiDung } from '@models/NguoiDung';

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