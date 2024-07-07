import express from 'express';
import { Mon } from '../../models/init-models';

const routerProducts = express.Router();

// Get all mon
routerProducts.get(
    '/',
    async (req, res) => {
        try {
            const currentPage = parseInt(req.query.page as string) || 1;
            const itemsPerPage = parseInt(req.query.limit as string) || 10;
            const offset = (currentPage - 1) * itemsPerPage;

            const { count: totalItems, rows: result } = await Mon.findAndCountAll({
                order: [['IDMon', 'DESC']],
                where: { Deleted: false },
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