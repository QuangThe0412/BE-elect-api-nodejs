import express from "express";
import routerMon from "./mon.route";
import routerNhomMon from "./nhomMon.route";
import routerLoaiMon from "./loaiMon.route";
import routerKhachHang from "./khachHang.route";

const router = express.Router();

router.use('/mon', routerMon);
router.use('/nhomMon', routerNhomMon);
router.use('/loaiMon', routerLoaiMon);
router.use('/khachHang', routerKhachHang);

export default router;