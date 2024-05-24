const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { google } = require('googleapis');
const fs = require('fs');

export const serviceGoogleApi = express();

passport.use(new GoogleStrategy({
    clientID: '213642646095-37hq5onmrjudjkfvuavnfdi7s53gfjnt.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3002'
},
    function (accessToken, refreshToken, profile, cb) {
        uploadFile(accessToken);
        cb(null, profile);
    }
));

passport.initialize();

serviceGoogleApi.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/drive.file'] }));

serviceGoogleApi.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });

export const uploadFile = (accessToken: any) => {
    const drive = google.drive({ version: 'v3', auth: accessToken });
    const fileMetadata = {
        'name': 'photo.jpg'
    };
    const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream('path/to/photo.jpg')
    };
    drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, function (err, file) {
        if (err) {
            console.error(err);
        } else {
            console.log('File Id: ', file.id);
        }
    });
}