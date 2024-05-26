import express from "express";
import routerMon from "./mon.route";
import routerNhomMon from "./nhomMon.route";
import routerLoaiMon from "./loaiMon.route";
import routerKhachHang from "./khachHang.route";
import routerAuth from "./auth.route";
import routerThongKe from "./thongke.route";
import adminAuthMiddleware from '../../middlewares/admin-auth.middleware';

const router = express.Router();

router.use('/auth', routerAuth);
router.use('/mon', routerMon);
router.use('/nhomMon', routerNhomMon);
router.use('/loaiMon', routerLoaiMon);
router.use('/khachHang',  routerKhachHang);
router.use('/thongke',  routerThongKe);
// router.use('/mon', adminAuthMiddleware, routerMon);
// router.use('/nhomMon', adminAuthMiddleware, routerNhomMon);
// router.use('/loaiMon', adminAuthMiddleware, routerLoaiMon);
// router.use('/khachHang', adminAuthMiddleware, routerKhachHang);

export default router;