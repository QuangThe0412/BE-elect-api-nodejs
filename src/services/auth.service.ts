import * as jwt from 'jsonwebtoken';
import { AuthUser } from '../index';
import config from '../config/config';
type JwtPayload = {
    user: AuthUser;
};
const authService = {
    generateTokens(
        payload,
        secret: string = config.ACCESS_TOKEN_SECRET ?? ''
    ) {
        const {exp,...payloadWithoutExp} = payload;

        const accessToken = jwt.sign(
            payloadWithoutExp,
            secret,
            {
                expiresIn: config.TOKEN_EXPIRE_IN,
            }
        );

        const refreshToken = jwt.sign(
            payloadWithoutExp,
            config.REFRESH_TOKEN_SECRET ?? '',
            { expiresIn: '7d' }
        );
        return { accessToken, refreshToken };
    },

    validateAccessToken(accessToken: string, secret: string) {
        try {
            const decoded = jwt.verify(accessToken, secret) as JwtPayload;
            return decoded.user;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    refreshToken(refreshToken: string, secret: string) {
        try {
            const decoded = jwt.verify(refreshToken, secret) as JwtPayload;
            const tokens = authService.generateTokens(
                decoded,
                secret
            );

            return {
                accessToken: tokens.accessToken,
            };
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
};
export default authService;
