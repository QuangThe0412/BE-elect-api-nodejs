import { NextFunction } from 'express';
import { Request, Response } from '../index';
import authService from '../services/auth.service';
import config from '../config/config';
function adminAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        req.user = authService.validateAccessToken(
            req.headers.authorization,
            config.ADMIN_ACCESS_TOKEN_SECRET
        );
        next();
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            error.status = 401; // Set the status code to 401
        }
        next(error);
    }
}

export default adminAuthMiddleware;
