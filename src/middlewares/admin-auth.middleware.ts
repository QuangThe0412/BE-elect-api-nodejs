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
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send();
        }
        return res.status(500).send();
    }
    next();
}

export default adminAuthMiddleware;
