const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { google } = require('googleapis');
const fs = require('fs');
import { FileUpload } from '../utils/index';
const querystring = require('querystring');

const config = process.env;
export const serviceGoogleApi = express();

passport.use(new GoogleStrategy({
    clientID: config.CLIENT_ID_GOOGLE_DRIVE,
    clientSecret: config.CLIENT_SECRET_GOOGLE_DRIVE,
    callbackURL: config.CALLBACK_URL_GOOGLE_DRIVE
},
    function (accessToken, refreshToken, profile, cb) {
        // Lưu accessToken vào session
        profile.config.NAME_ACCESS_TOKEN_GOOGLE_DRIVE = accessToken;
        profile.config.NAME_REFRESH_TOKEN_GOOGLE_DRIVE = refreshToken;
        cb(null, profile);
    }
));

passport.initialize();


serviceGoogleApi.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/drive.file'] }));

serviceGoogleApi.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });

export const uploadFile = (accessToken: any, fileUpload: FileUpload): Promise<any> => {
    return new Promise((resolve, reject) => {
        const drive = google.drive({ version: 'v3', auth: accessToken });
        const fileMetadata = {
            'name': fileUpload.name
        };
        const media = {
            mimeType: fileUpload.mimetype,
            body: fs.createReadStream(fileUpload.path)
        };
        drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
        }, function (err: any, file: { id: any; }) {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(file.id);
            }
        });
    });
}

export const GetLinkReturnCode = () => {
    const client_id = config.CLIENT_ID_GOOGLE_DRIVE;
    const redirect_uri = config.CALLBACK_URL_GOOGLE_DRIVE;
    const scope = 'https://www.googleapis.com/auth/drive.file';

    const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + querystring.stringify({
        client_id,
        redirect_uri,
        response_type: 'code',
        scope,
        access_type: 'offline',
        // prompt: 'consent' //yêu cầu cấp quyền mỗi lần gọi
    });

    return authUrl;
};

export const TryGetAccessToken = () => {
   
}