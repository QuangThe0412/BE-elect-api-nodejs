import express from 'express';
import { LoaiMon, Mon } from '../../models/init-models';
import { Op, Sequelize } from 'sequelize';
import { removeAccentAndSpecialChars } from '../../utils/index';

const routerProducts = express.Router();

// Get all mon
routerProducts.get(
    '/',
    async (req, res) => {
        try {
            const currentPage = parseInt(req.query.page as string) || 1;
            const itemsPerPage = parseInt(req.query.limit as string) || 10;
            const query = req.query.query as string || '';
            const offset = (currentPage - 1) * itemsPerPage;
            const sortKey = req.query.sortKey as string || 'IDMon';
            const reverse = req.query.reverse as string || 'ASC';
            const searchTerms = query.toLowerCase().split(' '); // Split the query into individual words
            const searchConditions = searchTerms.map(term => ({
                [Op.or]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('TenMon')), {
                        [Op.like]: `%${term}%`
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('TenKhongDau')), {
                        [Op.like]: `%${term}%`
                    })
                ]
            }));

            const finalQuery = {
                [Op.and]: searchConditions
            };

            const { count: totalItems, rows: result } = await Mon.findAndCountAll({
                order: [[sortKey, reverse]],
                where: {
                    Deleted: false,
                    [Op.and]: finalQuery
                },
                attributes: [
                    'IDMon',
                    'IDLoaiMon',
                    'TenMon',
                    'Image',
                    'DVTMon',
                    'DonGiaBanSi',
                    'DonGiaBanLe',
                    'DonGiaVon',
                    'SoLuongTonKho',
                    'ThoiGianBH',
                    'GhiChu'
                ],
                limit: itemsPerPage,
                offset: offset,
            });

            const totalPages = Math.ceil(totalItems / itemsPerPage);

            res.status(200).send({
                data: {
                    result,
                    totalPages,
                    currentPage,
                    itemsPerPage,
                    totalItems,
                },
                code: 'GET_ALL_MON_SUCCESS',
                mess: 'Nhận danh sách món thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//get mon by id
routerProducts.get(
    '/details/:id',
    async (req, res) => {
        try {
            const id = req.params.id;
            const result = await Mon.findOne({
                where: {
                    IDMon: id,
                    Deleted: false
                },
                attributes: [
                    'IDMon',
                    'IDLoaiMon',
                    'TenMon',
                    'Image',
                    'DVTMon',
                    'DonGiaBanSi',
                    'DonGiaBanLe',
                    'DonGiaVon',
                    'SoLuongTonKho',
                    'ThoiGianBH',
                    'GhiChu'
                ]
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

//get top 10 newest mon
routerProducts.get(
    '/newest',
    async (req, res) => {
        try {
            const result = await Mon.findAll({
                order: [['IDMon', 'DESC']],
                where: {
                    Deleted: false,
                    createDate: { [Op.gte]: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000) }
                },
                limit: 8,
            })
            res.status(200).send({
                data: result,
                code: 'GET_NEWEST_MON_SUCCESS',
                mess: 'Nhận danh sách món mới nhất thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//get related mon
routerProducts.get(
    '/related/:idCategory',
    async (req, res) => {
        try {
            const idCategory = req.params.idCategory;
            const result = await Mon.findAll({
                where: {
                    IDLoaiMon: idCategory,
                    Deleted: false
                },
                attributes: [
                    'IDMon',
                    'IDLoaiMon',
                    'TenMon',
                    'Image',
                    'DVTMon',
                    'DonGiaBanSi',
                    'DonGiaBanLe',
                    'DonGiaVon',
                    'SoLuongTonKho',
                    'ThoiGianBH',
                    'GhiChu'
                ],
                limit: 12,
            })

            res.status(200).send({
                data: result,
                code: 'GET_RELATED_MON_SUCCESS',
                mess: 'Nhận danh sách món liên quan thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });

//get mon by category
routerProducts.get(
    '/category/:nameCategory',
    async (req, res) => {
        try {
            const nameCategory = req.params.nameCategory;
            const currentPage = parseInt(req.query.page as string) || 1;
            const itemsPerPage = parseInt(req.query.limit as string) || 10;
            const query = req.query.query as string || '';
            const offset = (currentPage - 1) * itemsPerPage;
            const sortKey = req.query.sortKey as string || 'IDMon';
            const reverse = req.query.reverse as string || 'ASC';
            const searchTerms = query.toLowerCase().split(' '); // Split the query into individual words
            const searchConditions = searchTerms.map(term => ({
                [Op.or]: [
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('TenMon')), {
                        [Op.like]: `%${term}%`
                    }),
                    Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('TenKhongDau')), {
                        [Op.like]: `%${term}%`
                    })
                ]
            }));

            const finalQuery = {
                [Op.and]: searchConditions
            };

            const loaiMon = await LoaiMon.findAll({
                where: {
                    Deleted: false
                },
                attributes: ['IDLoaiMon', 'TenLoai']
            })

            const loaiMonIds = loaiMon.filter(m => removeAccentAndSpecialChars(m.TenLoai) === nameCategory)
                .map(m => m.IDLoaiMon);

            const { count: totalItems, rows: result } = await Mon.findAndCountAll({
                order: [[sortKey, reverse]],
                where: {
                    IDLoaiMon: loaiMonIds,
                    [Op.and]: finalQuery,
                    Deleted: false
                },
                attributes: [
                    'IDMon',
                    'IDLoaiMon',
                    'TenMon',
                    'Image',
                    'DVTMon',
                    'DonGiaBanSi',
                    'DonGiaBanLe',
                    'DonGiaVon',
                    'SoLuongTonKho',
                    'ThoiGianBH',
                    'GhiChu'
                ],
                limit: itemsPerPage,
                offset: offset,
            })

            const totalPages = Math.ceil(totalItems / itemsPerPage);

            console.log({ totalPages, currentPage });
            res.status(200).send({
                data: {
                    result,
                    totalPages,
                    currentPage,
                    itemsPerPage,
                    totalItems,
                },
                code: 'GET_MON_SUCCESS',
                mess: 'Nhận danh sách món theo loại thành công',
            });
        } catch (err) {
            console.error(err);
            res.status(500).send(err);
        }
    });
export default routerProducts;