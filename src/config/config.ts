import dotenv from 'dotenv';
import path from 'path';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.dev';
dotenv.config({ path: path.resolve(envFile) });

const config = {
    DB_NAME: process.env.DB_NAME,
    PORT: process.env.PORT,
    DB_PORT: process.env.DB_PORT,
    DB_HOST: process.env.DB_HOST,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_USER: process.env.DB_USER,
    ADMIN_ACCESS_TOKEN_SECRET: process.env.ADMIN_ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    TOKEN_EXPIRE_IN: process.env.TOKEN_EXPIRE_IN,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ADMIN_REFRESH_TOKEN_SECRET: process.env.ADMIN_REFRESH_TOKEN_SECRET,
    CLIENT_ID_GOOGLE_DRIVE : process.env.CLIENT_ID_GOOGLE_DRIVE,
    CLIENT_SECRET_GOOGLE_DRIVE : process.env.CLIENT_SECRET_GOOGLE_DRIVE,
    CALLBACK_URL_GOOGLE_DRIVE : process.env.CALLBACK_URL_GOOGLE_DRIVE,
    NAME_ACCESS_TOKEN_GOOGLE_DRIVE : process.env.NAME_ACCESS_TOKEN_GOOGLE_DRIVE,
    NAME_REFRESH_TOKEN_GOOGLE_DRIVE : process.env.NAME_REFRESH_TOKEN_GOOGLE_DRIVE,
};

export default config;
