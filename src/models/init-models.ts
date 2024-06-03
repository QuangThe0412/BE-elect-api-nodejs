import { Sequelize, DATE } from 'sequelize';
DATE.prototype._stringify = function _stringify(date: any, options: any) {
    date = this._applyTimezone(date, options);
    return date.format('YYYY-MM-DD HH:mm:ss.SSS');
};

import { Mon, MonAttributes } from './Mon';
import { NhomMon, NhomMonAttributes } from './NhomMon';
import { LoaiMon, LoaiMonAttributes } from './LoaiMon';
import { Banner, BannerAttributes } from './Banner';
import { ChiTietHD, ChiTietHDAttributes } from './ChiTietHD';
import { HoaDon, HoaDonAttributes } from './HoaDon';
import { KhachHang, KhachHangAttributes } from './KhachHang';
import { BaoGia, BaoGiaAttributes } from './BaoGia';
import { BaoGiaChiTiet, BaoGiaChiTietAttributes } from './BaoGiaChiTiet';
import { PhieuNhap, PhieuNhapAttributes } from './PhieuNhap';
import { ChiTietPhieuNhap, ChiTietPhieuNhapAttributes } from './ChiTietPhieuNhap';
import { PhieuXuat, PhieuXuatAttributes } from './PhieuXuat';
import { ChiTietPhieuXuat, ChiTietPhieuXuatAttributes } from './ChiTietPhieuXuat';
import { NguoiDung, NguoiDungAttributes } from './NguoiDung';
import { LoaiKhachHang,LoaiKhachHangAttributes } from './LoaiKhachHang';
import { Khuyenmai,KhuyenmaiAttributes } from './Khuyenmai';
import { ChiTietKM,ChiTietKMAttributes } from './ChiTietKM';


export {
    Mon as Mon,
    MonAttributes as MonAttributes,
    NhomMon as NhomMon,
    NhomMonAttributes as NhomMonAttributes,
    LoaiMon as LoaiMon,
    LoaiMonAttributes as LoaiMonAttributes,
    Banner as Banner,
    BannerAttributes as BannerAttributes,
    ChiTietHD as ChiTietHD,
    ChiTietHDAttributes as ChiTietHDAttributes,
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
    NguoiDung as NguoiDung,
    NguoiDungAttributes as NguoiDungAttributes,
    LoaiKhachHang as LoaiKhachHang,
    LoaiKhachHangAttributes as LoaiKhachHangAttributes,
    Khuyenmai as Khuyenmai,
    KhuyenmaiAttributes as KhuyenmaiAttributes,
    ChiTietKM as ChiTietKM,
    ChiTietKMAttributes as ChiTietKMAttributes

};

export function initModels(sequelize: Sequelize) {
    Mon.initModel(sequelize);
    NhomMon.initModel(sequelize);
    LoaiMon.initModel(sequelize);
    Banner.initModel(sequelize);
    ChiTietHD.initModel(sequelize);
    HoaDon.initModel(sequelize);
    KhachHang.initModel(sequelize);
    BaoGia.initModel(sequelize);
    BaoGiaChiTiet.initModel(sequelize);
    PhieuNhap.initModel(sequelize);
    ChiTietPhieuNhap.initModel(sequelize);
    PhieuXuat.initModel(sequelize);
    ChiTietPhieuXuat.initModel(sequelize);
    NguoiDung.initModel(sequelize);
    LoaiKhachHang.initModel(sequelize);
    Khuyenmai.initModel(sequelize);
    ChiTietKM.initModel(sequelize);
    return {
        Mon,
        NhomMon,
        LoaiMon,
        Banner,
        ChiTietHD,
        HoaDon,
        KhachHang,
        BaoGia,
        BaoGiaChiTiet,
        PhieuNhap,
        ChiTietPhieuNhap,
        PhieuXuat,
        ChiTietPhieuXuat,
        NguoiDung,
        LoaiKhachHang,
        Khuyenmai,
        ChiTietKM
    };
}
