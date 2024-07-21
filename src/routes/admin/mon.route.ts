import express from 'express';
import { LoaiMon, Mon } from '../../models/init-models';
import { GetCurrentUser, MergeWithOldData, removeAccentAndSpecialChars } from '../../utils';
import multer from 'multer';
import { uploadFile, tryDeleteFile } from '../../services/serviceGoogleApi';

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
            res.status(200).send({
                data: result,
                code: 'GET_ALL_MON_SUCCESS',
                mess: 'Nhận danh sách món thành công',
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
            res.status(200).send({
                data: result,
                code: 'GET_MON_SUCCESS',
                mess: 'Nhận thông tin món thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//create mon
routerMon.post(
    '/',
    upload.single('file'),
    async (req, res) => {
        try {
            const mon = req.body as Mon;
            const { MaTat } = mon;
            mon.IDMon = null;

            // update file
            const file = req.file as Express.Multer.File;
            if (file) {
                await uploadFile(file).then((result) => {
                    mon.Image = result.id;
                });
            }

            if (!MaTat) {
                return res.status(400).send({
                    code: 'MATAT_REQUIRED',
                    mess: 'Mã tắt không được để trống',
                });
            }

            //check if MaTat is existed
            const existedMonByMaTat = await Mon.findOne({
                where: {
                    MaTat,
                },
            });

            if (existedMonByMaTat) {
                return res.status(400).send({
                    code: 'MATAT_EXISTED',
                    mess: 'Mã tắt đã tồn tại',
                });
            }

            mon.DonGiaBanSi = mon.DonGiaBanSi || 0;
            mon.DonGiaBanLe = mon.DonGiaBanLe || 0;
            mon.DonGiaVon = mon.DonGiaVon || 0;
            mon.SoLuongTonKho = mon.SoLuongTonKho || 0;
            mon.ThoiGianBH = mon.ThoiGianBH || 0;
            mon.TenKhongDau = removeAccentAndSpecialChars(mon.TenMon);

            const loaiMon = await LoaiMon.findByPk(mon.IDLoaiMon);
            if (!loaiMon) return res.status(400).send({
                code: 'LOAIMON_NOT_FOUND',
                mess: 'Không tìm thấy loại món',
            });
            mon.createDate = new Date();
            mon.createBy = await GetCurrentUser(req, null);
            mon.modifyDate = null;
            const result = await Mon.create(mon);
            res.status(201).send({
                data: result,
                code: 'CREATE_MON_SUCCESS',
                mess: 'Tạo món thành công',
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
            const id = req.params.id;
            const oldMonData = await Mon.findByPk(id);
            if (!oldMonData) return res.status(404).send({
                code: 'MON_NOT_FOUND',
                mess: 'Không tìm thấy món',
            });

            let mon = req.body as Mon;
            // mon = MergeWithOldData(oldMonData, mon);
            const file = req.file as Express.Multer.File;
            if (file) {
                //remove old file
                if (oldMonData.Image) {
                    await tryDeleteFile(oldMonData.Image);
                }

                //update file
                await uploadFile(file).then((result) => {
                    mon.Image = result.id;
                });
            }

            const { MaTat, TenMon } = mon;
            if (MaTat && MaTat !== oldMonData.MaTat) {
                //check if MaTat is existed
                const existedMonByMaTat = await Mon.findOne({
                    where: {
                        MaTat,
                    },
                });

                if (existedMonByMaTat) {
                    return res.status(400).send({
                        code: 'MATAT_EXISTED',
                        mess: 'Mã tắt đã tồn tại',
                    });
                }
            }

            if (TenMon && TenMon !== oldMonData.TenMon) {
                mon.TenKhongDau = removeAccentAndSpecialChars(mon.TenMon);
            }

            mon.modifyDate = new Date();
            mon.modifyBy = await GetCurrentUser(req, null);
            await Mon.update(mon, {
                where: {
                    IDMon: id,
                },
            });
            res.status(200).send({
                data: mon,
                code: 'UPDATE_MON_SUCCESS',
                mess: 'Cập nhật món thành công',
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
                return res.status(404).send({
                    code: 'MON_NOT_FOUND',
                    mess: 'Không tìm thấy món',
                });
            }

            mon.Deleted = !mon.Deleted;
            mon.modifyDate = new Date();
            mon.modifyBy = await GetCurrentUser(req, null);
            await Mon.update(mon, {
                where: {
                    IDMon: id,
                },
            })
            res.status(200).send({
                data: mon,
                code: 'TOGGLE_ACTIVE_MON_SUCCESS',
                mess: 'Bật/Tắt món thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

export default routerMon;