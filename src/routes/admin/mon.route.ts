import express from 'express';
import { LoaiMon, Mon, ThongTinMon, ThongTin } from '../../models/init-models';
import { GetCurrentUser, getThongTinMon, slugifyHandle } from '../../utils';
import multer from 'multer';
import { uploadFile, tryDeleteFile } from '../../services/serviceGoogleApi';
import { MonRequestType, MonResponseType } from 'src/types/MonType';

const routerMon = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Get all mon
routerMon.get(
    '/',
    async (req, res) => {
        try {
            const _mon = await Mon.findAll({
                order: [['IDMon', 'DESC']],
            });

            const _result = await getThongTinMon(_mon);

            res.status(200).send({
                data: _result,
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
            const _mon = await Mon.findOne({
                where: {
                    IDMon: id,
                },
            })

            if (!_mon) {
                return res.status(404).send({
                    code: 'MON_NOT_FOUND',
                    mess: 'Không tìm thấy món',
                });
            }

            const _result = await getThongTinMon([_mon]);

            res.status(200).send({
                data: _result,
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
            const mon = req.body as MonRequestType;
            const { MaTat, idThongTin, DonGiaBanLe, DonGiaBanSi, DonGiaVon } = mon;
            const _maTat = MaTat?.trim();
            mon.IDMon = null;
            const _donGiaBanLe = DonGiaBanLe || 0;
            const _donGiaBanSi = DonGiaBanSi || 0;
            const _donGiaVon = DonGiaVon || 0;
            // update file
            const file = req.file as Express.Multer.File;
            if (file) {
                await uploadFile(file).then((result) => {
                    mon.Image = result.id;
                });
            }

            if (!_maTat) {
                return res.status(400).send({
                    code: 'MATAT_REQUIRED',
                    mess: 'Mã tắt không được để trống',
                });
            }

            //check if MaTat is existed
            const existedMonByMaTat = await Mon.findOne({
                where: {
                    MaTat: _maTat,
                },
            });

            if (existedMonByMaTat) {
                return res.status(400).send({
                    code: 'MATAT_EXISTED',
                    mess: 'Mã tắt đã tồn tại',
                });
            }

            mon.TenKhongDau = slugifyHandle(mon.TenMon);

            const loaiMon = await LoaiMon.findByPk(mon.IDLoaiMon);
            if (!loaiMon) return res.status(400).send({
                code: 'LOAIMON_NOT_FOUND',
                mess: 'Không tìm thấy loại món',
            });
            let currentUser = await GetCurrentUser(req, null);
            mon.SoLuongTonKho = mon.SoLuongTonKho || 0;
            mon.ThoiGianBH = mon.ThoiGianBH || 0;
            mon.createDate = new Date();
            mon.createBy = currentUser;
            mon.modifyDate = null;
            mon.MaTat = _maTat;

            let thongTin: ThongTin | null = null;
            if (idThongTin) {
                thongTin = await ThongTin.findOne({
                    where: {
                        Id: idThongTin,
                    },
                });

                if (!thongTin) {
                    return res.status(404).send({
                        code: 'THONGTIN_NOT_FOUND',
                        mess: 'Không tìm thấy thông tin',
                    });
                }

                mon.DonGiaBanSi = 0;
                mon.DonGiaBanLe = 0;
                mon.DonGiaVon = 0;
            }

            const monNew = await Mon.create(mon);

            let thongTinMon: ThongTinMon | null = null;
            if (thongTin) {
                thongTinMon = await ThongTinMon.create({
                    IdThongTin: thongTin.Id,
                    IdMon: monNew?.dataValues?.IDMon,
                    DonGiaBanLe: _donGiaBanLe,
                    DonGiaBanSi: _donGiaBanSi,
                    DonGiaVon: _donGiaVon,
                    createBy: currentUser,
                    createDate: new Date(),
                });
            }

            const _result = {
                ...monNew.dataValues as Mon,
                idThongTinMon: thongTinMon?.Id || 0,
                DonGiaBanLe: _donGiaBanLe,
                DonGiaBanSi: _donGiaBanSi,
                DonGiaVon: _donGiaVon,
                size: thongTin?.Size || '',
                color: thongTin?.Color || '',
            } as MonResponseType;

            res.status(201).send({
                data: _result,
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
            const idMon = parseInt(id);
            const oldMonData = await Mon.findByPk(idMon);
            if (!oldMonData) return res.status(404).send({
                code: 'MON_NOT_FOUND',
                mess: 'Không tìm thấy món',
            });

            let monRequest = req.body as MonRequestType;
            // mon = MergeWithOldData(oldMonData, mon);
            const file = req.file as Express.Multer.File;
            if (file) {
                //remove old file
                if (oldMonData.Image) {
                    await tryDeleteFile(oldMonData.Image);
                }

                //update file
                await uploadFile(file).then((result) => {
                    monRequest.Image = result.id;
                });
            }

            const { MaTat, TenMon, idThongTin, DonGiaBanLe, DonGiaBanSi, DonGiaVon } = monRequest;
            const _donGiaBanLe = DonGiaBanLe || 0;
            const _donGiaBanSi = DonGiaBanSi || 0;
            const _donGiaVon = DonGiaVon || 0;
            const _matat = MaTat?.trim();
            const currentuser = await GetCurrentUser(req, null);
            if (_matat && _matat !== oldMonData.MaTat) {
                //check if MaTat is existed
                const existedMonByMaTat = await Mon.findOne({
                    where: {
                        MaTat: _matat,
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
                monRequest.TenKhongDau = slugifyHandle(monRequest.TenMon);
            }

            let thongTinMon: ThongTinMon | null = null;
            if (idThongTin) {
                const existedThongTin = await ThongTin.findOne({
                    where: {
                        Id: idThongTin,
                        Deleted: false,
                    },
                });

                if (!existedThongTin) {
                    return res.status(404).send({
                        code: 'THONGTIN_NOT_FOUND',
                        mess: 'Không tìm thấy thông tin',
                    });
                }

                thongTinMon = await ThongTinMon.findOne({
                    where: {
                        IdThongTin: idThongTin,
                        IdMon: idMon,
                    },
                });

                if (!thongTinMon) {
                    await ThongTinMon.create({
                        IdThongTin: idThongTin,
                        IdMon: idMon,
                        DonGiaBanLe: _donGiaBanLe,
                        DonGiaBanSi: _donGiaBanSi,
                        DonGiaVon: _donGiaVon,
                        createBy: currentuser,
                        createDate: new Date(),
                    });
                } else {
                    thongTinMon.DonGiaBanLe = _donGiaBanLe;
                    thongTinMon.DonGiaBanSi = _donGiaBanSi;
                    thongTinMon.DonGiaVon = _donGiaVon;
                    thongTinMon.modifyBy = currentuser;
                    thongTinMon.Deleted = false;
                    thongTinMon.modifyDate = new Date();
                    await ThongTinMon.update(thongTinMon, {
                        where: {
                            IdThongTin: idThongTin,
                            IdMon: idMon,
                        },
                    });
                }

                //update don gia
                monRequest.DonGiaBanSi = 0;
                monRequest.DonGiaBanLe = 0;
                monRequest.DonGiaVon = 0;
            }

            await Mon.update({
                ...monRequest,
                MaTat: _matat,
                TenMon: monRequest.TenMon,
                TenKhongDau: monRequest.TenKhongDau,
                IDLoaiMon: monRequest.IDLoaiMon,
                SoLuongTonKho: monRequest.SoLuongTonKho,
                ThoiGianBH: monRequest.ThoiGianBH || 0,
                Image: monRequest.Image,
                modifyBy: currentuser,
                modifyDate: new Date(),
            }, {
                where: {
                    IDMon: idMon,
                },
            });

            let thongTin = await ThongTin.findOne({
                where: {
                    Id: idThongTin,
                    Deleted: false,
                },
            });

            const _result = {
                ...monRequest as Mon,
                idThongTinMon: idThongTin,
                DonGiaBanLe: _donGiaBanLe,
                DonGiaBanSi: _donGiaBanSi,
                DonGiaVon: _donGiaVon,
                size: thongTin?.Size || '',
                color: thongTin?.Color || '',
            } as MonResponseType;

            res.status(200).send({
                data: _result,
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
            const currentUser = await GetCurrentUser(req, null);
            const id = req.params.id;
            const mon = await Mon.findByPk(id);
            if (mon == null) {
                return res.status(404).send({
                    code: 'MON_NOT_FOUND',
                    mess: 'Không tìm thấy món',
                });
            }

            const { IDMon } = mon;
            mon.Deleted = !mon.Deleted;
            mon.modifyDate = new Date();
            mon.modifyBy = currentUser;
            await Mon.update(mon, {
                where: {
                    IDMon: id,
                },
            })

            const thongTinMon = await ThongTinMon.findOne({
                where: {
                    IdMon: IDMon,
                },
            });

            if (thongTinMon) {
                thongTinMon.Deleted = !thongTinMon.Deleted;
                thongTinMon.modifyDate = new Date();
                thongTinMon.modifyBy = currentUser;
                await ThongTinMon.update(thongTinMon, {
                    where: {
                        IdMon: IDMon,
                    },
                });
            }

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