import express from 'express';
import { LoaiMon, Mon } from '../../models/init-models';
import { MergeWithOldData } from '../../utils';
import multer from 'multer';
import { requestAuthGoogle, uploadFile } from '../../services/uploadFile.service';
import { FileUpload } from '../../utils/index';

const routerMon = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all mon
routerMon.get(
    '/',
    async (req, res) => {
        try {
            const result = await Mon.findAll({
                order: [['IDMon', 'DESC']],
            });
            res.send({
                data: result,
                code: 'GET_ALL_MON_SUCCESS',
                mess: 'Get all mon success',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//get mon by id
routerMon.get(
    '/:id',
    async (req, res) => {
        try {
            const id = req.params.id;
            const result = await Mon.findOne({
                where: {
                    IDMon: id,
                },
            })
            res.send({
                data: result,
                code: 'GET_MON_SUCCESS',
                mess: 'Get mon success',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//create mon
routerMon.post(
    '/',
    upload.single('image'),
    async (req, res) => {
        try {
            let ggNameImage: any = '';
            const file = req.file;
            console.log('-------------------------------------------')
            console.log(file);
            if (file) {
                let accessTokenGoogleDrive = req.body.accessTokenGoogleDrive;
                console.log({ accessTokenGoogleDrive })
                if (!accessTokenGoogleDrive) {
                    res.redirect('/auth/google');
                }

                let fileUpload: FileUpload = {
                    name: (file as Express.Multer.File).originalname,
                    mimetype: file.mimetype,
                    path: file.path
                };

                uploadFile(accessTokenGoogleDrive, fileUpload).then((result) => {
                    console.log(result);
                    ggNameImage = result.data.id;
                });
            }

            const mon = req.body as Mon;
            mon.IDMon = null;
            mon.Image = ggNameImage;
            mon.DonGiaBanSi = mon.DonGiaBanSi || 0;
            mon.DonGiaBanLe = mon.DonGiaBanLe || 0;
            mon.DonGiaVon = mon.DonGiaVon || 0;
            mon.SoLuongTonKho = mon.SoLuongTonKho || 0;
            mon.ThoiGianBH = mon.ThoiGianBH || 0;

            const loaiMon = await LoaiMon.findByPk(mon.IDLoaiMon);
            if (!loaiMon) return res.status(400).send('Loai mon not found');
            mon.NgayTao = new Date();
            const result = await Mon.create(mon);
            res.send({
                data: result,
                code: 'CREATE_MON_SUCCESS',
                mess: 'Create mon success',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//update mon
routerMon.put(
    '/:id',
    upload.single('file'),
    async (req, res) => {
        try {
            let ggNameImage: any = '';
            const file = req.file;
            if (file) {
                let accessTokenGoogleDrive = req.body.accessTokenGoogleDrive;

                if (!accessTokenGoogleDrive) {
                    const authUrl = requestAuthGoogle();
                    res.status(401).json({
                        code : 'UNAUTHORIZED_ACCESS_TO_GOOGLE_DRIVE',
                        mess : 'Unauthorized access to google drive',
                        data : authUrl
                     });
                }

                let fileUpload: FileUpload = {
                    name: (file as Express.Multer.File).originalname,
                    mimetype: file.mimetype,
                    path: file.path
                };

                uploadFile(accessTokenGoogleDrive, fileUpload).then((result) => {
                    console.log(result);
                    ggNameImage = result.data.id;
                });
            }

            const id = req.params.id;

            const oldMonData = await Mon.findByPk(id);
            if (!oldMonData) return res.status(404).send('Not found');

            let mon = req.body as Mon;
            mon = MergeWithOldData(oldMonData, mon);

            mon.NgaySua = new Date();
            await Mon.update(mon, {
                where: {
                    IDMon: id,
                },
            });
            res.send({
                data: mon,
                code: 'UPDATE_MON_SUCCESS',
                mess: 'Update mon success',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//delete mon
routerMon.delete(
    '/:id',
    async (req, res) => {
        try {
            const id = req.params.id;
            const mon = await Mon.findByPk(id);
            if (mon == null) {
                return res.status(404).send('Not found');
            }

            mon.Deleted = !mon.Deleted;
            mon.NgaySua = new Date();
            await Mon.update(mon, {
                where: {
                    IDMon: id,
                },
            })
            res.send({
                data: mon,
                code: 'TOGGLE_ACTIVE_MON_SUCCESS',
                mess: 'Toggle active mon success',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

export default routerMon;