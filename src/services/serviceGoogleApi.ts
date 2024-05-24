import multer from "multer";
const express = require('express');
const { google } = require('googleapis');
const stream = require("stream");
const upload = multer();
const path = require("path");

const config = process.env;
const ID_FOLDER_GG_DRIVE = config.ID_FOLDER_GG_DRIVE;

export const serviceGoogleApi = express();

const KEYFILEPATH = path.join(__dirname, '..', '..', 'cred.json');
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});


// serviceGoogleApi.post("/upload", upload.any(), async (req, res) => {
//     try {
//         const { files } = req;

//         for (let f = 0; f < files.length; f += 1) {
//             await uploadFile(files[f]);
//         }

//         res.status(200).send("Form Submitted");
//     } catch (f) {
//         res.send(f.message);
//     }
// });

export const uploadFile = async (fileObject : Express.Multer.File) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);
    const { data } = await google.drive({ version: "v3", auth }).files.create({
        media: {
            mimeType: fileObject.mimetype,
            body: bufferStream,
        },
        requestBody: {
            name: fileObject.originalname,
            parents: [ID_FOLDER_GG_DRIVE],
        },
        fields: "id,name",
    });
    return data;
};