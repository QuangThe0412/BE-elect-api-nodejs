import express from "express";
import routerMon from "./mon.route";
import routerNhomMon from "./nhomMon.route";
import routerLoaiMon from "./loaiMon.route";
import routerKhachHang from "./khachHang.route";
import routerAuth from "./auth.route";
import routerThongKe from "./thongke.route";
import adminAuthMiddleware from '../../middlewares/admin-auth.middleware';
import { RoleEnum } from '../../utils';

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
        role: [RoleEnum.ADMIN, RoleEnum.CASHIER, RoleEnum.SALER, RoleEnum.INVENTORY, RoleEnum.GUEST]
    },
    {
        path: paths.mon,
        role: [RoleEnum.ADMIN]
    },
    {
        path: paths.nhomMon,
        role: [RoleEnum.ADMIN]
    },
    {
        path: paths.loaiMon,
        role: [RoleEnum.ADMIN, RoleEnum.GUEST]
    },
    {
        path: paths.khachHang,
        role: [RoleEnum.ADMIN]
    },
    {
        path: paths.thongke,
        role: [RoleEnum.ADMIN,  RoleEnum.GUEST]
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