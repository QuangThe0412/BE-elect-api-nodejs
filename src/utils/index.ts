import bcrypt from 'bcrypt';
import config from '../config/config';
import { Admin } from '../models/init-models';

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
        const hash = await bcrypt.hash(password + userName + config.ADMIN_ACCESS_TOKEN_SECRET, saltRounds);
        return hash;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const ComparePassword = async (userName: string, password: string, hash: string) => {
    try {
        const match = await bcrypt.compare(password + userName + config.ADMIN_ACCESS_TOKEN_SECRET, hash);
        return match;
    } catch (err) {
        console.error(err);
        return false;
    }
};

export const GetRoles = (admin: Admin) => {
    const roles = [];
    if (admin.admin) {
        roles.push('ADMIN');
    }
    if (admin.cashier) {
        roles.push('CASHIER');
    }
    if (admin.saler) {
        roles.push('SALER');
    }
    if (admin.inventory) {
        roles.push('INVENTORY');
    }
    return roles;
}