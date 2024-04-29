import { Sequelize } from 'sequelize';
import { Mon, MonAttributes } from './Mon';
import { NhomMon, NhomMonAttributes } from './NhomMon';
import { LoaiMon, LoaiMonAttributes } from './LoaiMon';
import { Banner,BannerAttributes } from './Banner';
import { ChiTietHoaDon,ChiTietHoaDonAttributes } from './ChiTietHoaDon';
import { HoaDon,HoaDonAttributes } from './HoaDon';
import { KhachHang,KhachHangAttributes } from './KhachHang';
import { BaoGia,BaoGiaAttributes } from './BaoGia';
import { BaoGiaChiTiet,BaoGiaChiTietAttributes } from './BaoGiaChiTiet';
import { PhieuNhap,PhieuNhapAttributes } from './PhieuNhap';
import { ChiTietPhieuNhap,ChiTietPhieuNhapAttributes } from './ChiTietPhieuNhap';
import { PhieuXuat,PhieuXuatAttributes } from './PhieuXuat';
import { ChiTietPhieuXuat,ChiTietPhieuXuatAttributes } from './ChiTietPhieuXuat';

export {
    Mon as Mon,
    MonAttributes as MonAttributes,
    NhomMon as NhomMon,
    NhomMonAttributes as NhomMonAttributes,
    LoaiMon as LoaiMon,
    LoaiMonAttributes as LoaiMonAttributes,
    Banner as Banner,
    BannerAttributes as BannerAttributes,
    ChiTietHoaDon as ChiTietHoaDon,
    ChiTietHoaDonAttributes as ChiTietHoaDonAttributes,
    HoaDon as HoaDon,
    HoaDonAttributes as HoaDonAttributes,
    KhachHang as KhachHang,
    KhachHangAttributes as KhachHangAttributes,
    BaoGia as BaoGia,
    BaoGiaAttributes as BaoGiaAttributes,
    BaoGiaChiTiet as BaoGiaChiTiet,
    BaoGiaChiTietAttributes as BaoGiaChiTietAttributes,
    PhieuNhap as PhieuNhap,
    PhieuNhapAttributes as PhieuNhapAttributes,
    ChiTietPhieuNhap as ChiTietPhieuNhap,
    ChiTietPhieuNhapAttributes as ChiTietPhieuNhapAttributes,
    PhieuXuat as PhieuXuat,
    PhieuXuatAttributes as PhieuXuatAttributes,
    ChiTietPhieuXuat as ChiTietPhieuXuat,
    ChiTietPhieuXuatAttributes as ChiTietPhieuXuatAttributes,
};

export function initModels(sequelize: Sequelize) {
    Mon.initModel(sequelize);
    NhomMon.initModel(sequelize);
    LoaiMon.initModel(sequelize);
    Banner.initModel(sequelize);
    ChiTietHoaDon.initModel(sequelize);
    HoaDon.initModel(sequelize);
    KhachHang.initModel(sequelize);
    BaoGia.initModel(sequelize);
    BaoGiaChiTiet.initModel(sequelize);
    PhieuNhap.initModel(sequelize);
    ChiTietPhieuNhap.initModel(sequelize);
    PhieuXuat.initModel(sequelize);
    ChiTietPhieuXuat.initModel(sequelize);
    return {
        Mon,
        NhomMon,
        LoaiMon,
        Banner,
        ChiTietHoaDon,
        HoaDon,
        KhachHang,
        BaoGia,
        BaoGiaChiTiet,
        PhieuNhap,
        ChiTietPhieuNhap,
        PhieuXuat,
        ChiTietPhieuXuat,
    };
}
