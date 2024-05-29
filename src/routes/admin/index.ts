import express from "express";
import routerMon from "./mon.route";
import routerNhomMon from "./nhomMon.route";
import routerLoaiMon from "./loaiMon.route";
import routerKhachHang from "./khachHang.route";
import routerAuth from "./auth.route";
import routerThongKe from "./thongke.route";
import adminAuthMiddleware from '../../middlewares/admin-auth.middleware';

const paths = {
    auth: '/auth',
    mon: '/mon',
    nhomMon: '/nhomMon',
    loaiMon: '/loaiMon',
    khachHang: '/khachHang',
    thongke: '/thongke'
};

const roleAccess = [
    {
        path: paths.auth,
        role: ['ADMIN', 'CASHIER', 'SALER', 'INVENTORY', 'GUEST']
    },
    {
        path: paths.mon,
        role: ['ADMIN']
    },
    {
        path: paths.nhomMon,
        role: ['ADMIN']
    },
    {
        path: paths.loaiMon,
        role: ['ADMIN', 'GUEST']
    },
    {
        path: paths.khachHang,
        role: ['ADMIN']
    },
    {
        path: paths.thongke,
        role: ['ADMIN', 'GUEST']
    }
];

const router = express.Router();

router.use(paths.auth, routerAuth);
router.use(paths.mon, adminAuthMiddleware, routerMon);
router.use(paths.nhomMon, adminAuthMiddleware, routerNhomMon);
router.use(paths.loaiMon, adminAuthMiddleware, routerLoaiMon);
router.use(paths.khachHang, adminAuthMiddleware, routerKhachHang);
router.use(paths.thongke, adminAuthMiddleware, routerThongKe);

export { router, roleAccess, paths };