import express from "express";
import { RoleEnum } from '../../utils';
import routerMon from "./mon.route";
import routerNhomMon from "./nhomMon.route";
import routerLoaiMon from "./loaiMon.route";
import routerKhachHang from "./khachHang.route";
import routerAuth from "./auth.route";
import routerThongKe from "./thongke.route";
import adminAuthMiddleware from '../../middlewares/admin-auth.middleware';
import routerAccount from "./account.route";
import routerNguoiDung from "./nguoiDung.route";
import routerLoaiKhachHang from "./loaiKhachHang.route";
import routerKhuyenMai from "./khuyenMai.route";
import routerChiTietKM from "./chiTietKhuyenMai.route";
import routerHoaDon from "./hoaDon.route";
import routerChiTietHD from "./chiTietHD.route";

const paths = {
    auth: '/auth',
    mon: '/mon',
    nhomMon: '/nhomMon',
    loaiMon: '/loaiMon',
    khachHang: '/khachHang',
    thongke: '/thongke',
    account: '/account',
    nguoiDung: '/nguoiDung',
    loaiKhachHang: '/loaiKhachHang',
    khuyenMai: '/khuyenMai',
    chiTietKM: '/chiTietKhuyenMai',
    hoaDon:'/hoaDon',
    chiTietHD:'/chiTietHoaDon',
};

const roleAccess = [
    {
        path: paths.auth,
        role: [RoleEnum.ADMIN, RoleEnum.CASHIER, RoleEnum.SALER, RoleEnum.INVENTORY, RoleEnum.GUEST]
    },
    {
        path: paths.account,
        role: [RoleEnum.ADMIN, RoleEnum.CASHIER, RoleEnum.SALER, RoleEnum.INVENTORY, RoleEnum.GUEST]
    },
    {
        path: paths.nguoiDung,
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
        role: [RoleEnum.ADMIN]
    },
    {
        path: paths.khachHang,
        role: [RoleEnum.ADMIN]
    },
    {
        path: paths.thongke,
        role: [RoleEnum.ADMIN]
    },
    {
        path: paths.loaiKhachHang,
        role: [RoleEnum.ADMIN]
    },
    {
        path: paths.khuyenMai,
        role: [RoleEnum.ADMIN]
    },
    {
        path: paths.chiTietKM,
        role: [RoleEnum.ADMIN]
    },
    {
        path: paths.hoaDon,
        role: [RoleEnum.ADMIN]
    },
    {
        path: paths.chiTietHD,
        role: [RoleEnum.ADMIN]
    },
];

const router = express.Router();

router.use(paths.auth, routerAuth);
router.use(paths.mon, adminAuthMiddleware, routerMon);
router.use(paths.nguoiDung, adminAuthMiddleware, routerNguoiDung);
router.use(paths.account, adminAuthMiddleware, routerAccount);
router.use(paths.nhomMon, adminAuthMiddleware, routerNhomMon);
router.use(paths.loaiMon, adminAuthMiddleware, routerLoaiMon);
router.use(paths.khachHang, adminAuthMiddleware, routerKhachHang);
router.use(paths.thongke, adminAuthMiddleware, routerThongKe);
router.use(paths.loaiKhachHang, adminAuthMiddleware, routerLoaiKhachHang);
router.use(paths.khuyenMai, adminAuthMiddleware, routerKhuyenMai);
router.use(paths.chiTietKM, adminAuthMiddleware, routerChiTietKM);
router.use(paths.hoaDon, adminAuthMiddleware, routerHoaDon);
router.use(paths.chiTietHD, adminAuthMiddleware, routerChiTietHD);

export { router, roleAccess, paths };