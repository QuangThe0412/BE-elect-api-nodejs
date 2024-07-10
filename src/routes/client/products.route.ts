import express from 'express';
import { Mon } from '../../models/init-models';
import { Op, Sequelize } from 'sequelize';

const routerProducts = express.Router();

// Get all mon
routerProducts.get(
    '/',
    async (req, res) => {
        try {
            const currentPage = parseInt(req.query.page as string) || 1;
            const itemsPerPage = parseInt(req.query.limit as string) || 10;
            const idLoaiMon = parseInt(req.query.category as string) || 0;
            const query = req.query.query as string || '';
            console.log({ query });
            const offset = (currentPage - 1) * itemsPerPage;
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
                order: [['IDMon', 'DESC']],
                where: {
                    IDLoaiMon: idLoaiMon ? idLoaiMon : !null,
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
    '/:id',
    async (req, res) => {
        try {
            const id = req.params.id;
            const result = await Mon.findOne({
                where: {
                    IDMon: id,
                    Deleted: false
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

export default routerProducts;