import express from 'express';
import { LoaiMon, Mon } from '../../models/init-models';
import { MergeWithOldData } from '../../utils';

const routerMon = express.Router();

// Get all mon
routerMon.get(
    '/',
    async (req, res) => {
        try {
            const result = await Mon.findAll({
                order: [['IDMon', 'DESC']],
            });
            res.send(result);
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
            res.send(await Mon.findOne({
                where: {
                    IDMon: id,
                },
            }));
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//create mon
routerMon.post(
    '/',
    async (req, res) => {
        try {
            const mon = req.body as Mon;
            mon.DonGiaBanSi = mon.DonGiaBanSi || 0;
            mon.DonGiaBanLe = mon.DonGiaBanLe || 0;
            mon.DonGiaVon = mon.DonGiaVon || 0;
            mon.SoLuongTonKho = mon.SoLuongTonKho || 0;
            mon.ThoiGianBH = mon.ThoiGianBH || 0;

            const loaiMon = await LoaiMon.findByPk(mon.IDLoaiMon);
            if (!loaiMon) return res.status(400).send('Loai mon not found');
            mon.NgayTao = new Date();
            res.send(await Mon.create(mon));
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//update mon
routerMon.put(
    '/:id',
    async (req, res) => {
        try {
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
            res.send('Update mon success');
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

            mon.Deleted = true;
            mon.NgaySua = new Date();
            await Mon.update(mon, {
                where: {
                    IDMon: id,
                },
            })
            res.send('Delete mon success');
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

export default routerMon;