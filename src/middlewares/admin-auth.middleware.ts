import { NextFunction } from 'express';
import { AuthUser, Request, Response } from '../index';
import authService from '../services/auth.service';
import config from '../config/config';
import { roleAccess } from '../routes/admin';

function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { headers } = req;
        if(headers.authorization === undefined) {
            return res.status(401).send();
        }
        
        req.user = authService.validateAccessToken(
            req.headers.authorization,
            config.ADMIN_ACCESS_SECRET
        );

        const result = checkRoleAccess(req?.baseUrl, req.user);
        if (result) {
            return result;
        }

        next();
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            error.status = 401; // Set the status code to 401
        }
        next(error);
    }
}

const checkRoleAccess = (path: string, user: AuthUser) => {
    try {
        const role = roleAccess.find((role) => {
            return path.toLowerCase().includes(role.path.toLowerCase());
        });
        if (!role) {
            return {
                status: 404,
                mess: 'Không tìm thấy role cho ' + path
            };
        }

        let checkRole = (user.roles as string[]).some(item => role.role.includes(item));
        if (!checkRole) {
            return {
                status: 403,
                mess: 'Bạn không đủ quyền truy cập vào ' + path
            };
        }
    } catch (error: any) {
        throw error;
    }
};

export default adminAuthMiddleware;
