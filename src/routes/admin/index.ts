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
import routerCongNo from "./congNo.route";
import routerChiTietCongNo from "./chiTietCongNo.route";
import routerPhieuNhap from "./phieuNhap.route";
import routerChiTietPhieuNhap from "./chiTietPhieuNhap.route";
import routerThongTinMon from "./thongTinMon.route";

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
    hoaDon: '/hoaDon',
    chiTietHD: '/chiTietHoaDon',
    congNo: '/congNo',
    chiTietCongNo: '/chiTietCongNo',
    phieuNhap: '/phieuNhap',
    chiTietPhieuNhap: '/chiTietPhieuNhap',
    phieuXuat: '/phieuXuat',
    chiTietPhieuXuat: '/chiTietPhieuXuat',
    thongTinMon: '/thongTinMon',
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
    {
        path: paths.congNo,
        role: [RoleEnum.ADMIN]
    },
    {
        path: paths.chiTietCongNo,
        role: [RoleEnum.ADMIN]
    },
    {
        path: paths.phieuNhap,
        role: [RoleEnum.ADMIN]
    },
    {
        path: paths.chiTietPhieuNhap,
        role: [RoleEnum.ADMIN]
    },
    {
        path: paths.phieuXuat,
        role: [RoleEnum.ADMIN]
    },
    {
        path: paths.chiTietPhieuXuat,
        role: [RoleEnum.ADMIN]
    },
];

const router = express.Router();

router.use('/admin' + paths.auth, routerAuth);
router.use('/admin' + paths.mon, adminAuthMiddleware, routerMon);
router.use('/admin' + paths.nguoiDung, adminAuthMiddleware, routerNguoiDung);
router.use('/admin' + paths.account, adminAuthMiddleware, routerAccount);
router.use('/admin' + paths.nhomMon, adminAuthMiddleware, routerNhomMon);
router.use('/admin' + paths.loaiMon, adminAuthMiddleware, routerLoaiMon);
router.use('/admin' + paths.khachHang, adminAuthMiddleware, routerKhachHang);
router.use('/admin' + paths.thongke, adminAuthMiddleware, routerThongKe);
router.use('/admin' + paths.loaiKhachHang, adminAuthMiddleware, routerLoaiKhachHang);
router.use('/admin' + paths.khuyenMai, adminAuthMiddleware, routerKhuyenMai);
router.use('/admin' + paths.chiTietKM, adminAuthMiddleware, routerChiTietKM);
router.use('/admin' + paths.hoaDon, adminAuthMiddleware, routerHoaDon);
router.use('/admin' + paths.chiTietHD, adminAuthMiddleware, routerChiTietHD);
router.use('/admin' + paths.congNo, adminAuthMiddleware, routerCongNo);
router.use('/admin' + paths.chiTietCongNo, adminAuthMiddleware, routerChiTietCongNo);
router.use('/admin' + paths.phieuNhap, adminAuthMiddleware, routerPhieuNhap);
router.use('/admin' + paths.chiTietPhieuNhap, adminAuthMiddleware, routerChiTietPhieuNhap);
router.use('/admin' + paths.thongTinMon, adminAuthMiddleware, routerThongTinMon);

export { router, roleAccess, paths };