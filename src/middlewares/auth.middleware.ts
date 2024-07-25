import { NextFunction } from 'express';
import { Request, Response } from '../index';
import authService from '../services/auth.service';
import config from '../config/config';
function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { headers } = req;
        if(headers.authorization === undefined) {
            return res.status(401).send();
        }

        req.user = authService.validateAccessToken(
            req.headers.authorization as string,
            config.ACCESS_TOKEN_SECRET as string
        );
    } catch (error: any) {
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.status(401).send();
        }
        return res.status(500).send();
    }
    next();
}

export default authMiddleware;
