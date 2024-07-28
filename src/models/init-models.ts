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
import { CongNoKH,CongNoKHAttributes } from './CongNoKH';
import { ChiTietCongNoKH,ChiTietCongNoKHAttributes } from './ChiTietCongNoKH';

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
    ChiTietKMAttributes as ChiTietKMAttributes,
    CongNoKH as CongNoKH,
    CongNoKHAttributes as CongNoKHAttributes,
    ChiTietCongNoKH as ChiTietCongNoKH,
    ChiTietCongNoKHAttributes as ChiTietCongNoKHAttributes,

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
    CongNoKH.initModel(sequelize);
    ChiTietCongNoKH.initModel(sequelize);

    // Add relations Mon
    NhomMon.hasMany(LoaiMon, { as: 'LoaiMon', foreignKey: 'IDNhomMon' });
    LoaiMon.belongsTo(NhomMon, { as: 'R_LoaiMon', foreignKey: 'IDNhomMon' });
    LoaiMon.hasMany(Mon, { as: 'Mon', foreignKey: 'IDLoaiMon' });
    Mon.belongsTo(LoaiMon, { as: 'R_LoaiMon_Mon', foreignKey: 'IDLoaiMon' });
    //hoa don
    HoaDon.hasMany(ChiTietHD, { as: 'ChiTietHD', foreignKey: 'IDHoaDon' });
    ChiTietHD.belongsTo(HoaDon, { as: 'R_HoaDon', foreignKey: 'IDHoaDon ' });
    ChiTietHD.hasMany(Mon, { as: 'Mon', foreignKey: 'IDMon' });
    Mon.belongsTo(ChiTietHD, { as: 'R_HoaDon_Mon', foreignKey: 'IDMon' });
    //khach hang
    KhachHang.hasMany(HoaDon, { as: 'HoaDon', foreignKey: 'IDKhachHang' });
    HoaDon.belongsTo(KhachHang, { as: 'R_KhachHang_HoaDon', foreignKey: 'IDKhachHang' });
    // //baogia
    // BaoGia.hasMany(BaoGiaChiTiet, { as: 'BaoGiaChiTiet', foreignKey: 'IDBaoGia' });
    // BaoGiaChiTiet.belongsTo(BaoGia, { as: 'IDBaoGia_BaoGia', foreignKey: 'IDBaoGia' });
    // BaoGia.belongsTo(KhachHang, { as: 'IDKhachHang_KhachHang', foreignKey: 'IDKhachHang' });
    // Mon.hasMany(BaoGiaChiTiet, { as: 'BaoGiaChiTiet', foreignKey: 'IDMon' });
    // BaoGiaChiTiet.belongsTo(Mon, { as: 'IDMon_Mon', foreignKey: 'IDMon' });
    //phieu nhap
    PhieuNhap.hasMany(ChiTietPhieuNhap, { as: 'ChiTietPhieuNhap', foreignKey: 'IDPhieuNhap' });
    ChiTietPhieuNhap.belongsTo(PhieuNhap, { as: 'R_PhieuNhap', foreignKey: 'IDPhieuNhap' });
    ChiTietPhieuNhap.hasMany(Mon, { as: 'Mon', foreignKey: 'IDMon' });
    Mon.belongsTo(ChiTietPhieuNhap, { as: 'R_PhieuNhap_Mon', foreignKey: 'IDMon' });
    //phieu xuat
    PhieuXuat.hasMany(ChiTietPhieuXuat, { as: 'ChiTietPhieuXuat', foreignKey: 'IDPhieuXuat' });
    ChiTietPhieuXuat.belongsTo(PhieuXuat, { as: 'R_PhieuXuat', foreignKey: 'IDPhieuXuat' });
    ChiTietPhieuXuat.hasMany(Mon, { as: 'Mon', foreignKey: 'IDMon' });
    Mon.belongsTo(ChiTietPhieuXuat, { as: 'R_PhieuXuat_Mon', foreignKey: 'IDMon' });
    //khach hang
    LoaiKhachHang.hasMany(KhachHang, { as: 'KhachHang', foreignKey: 'IDLoaiKH' });
    KhachHang.belongsTo(LoaiKhachHang, { as: 'R_KhachHang', foreignKey: 'IDLoaiKH' });
    //khuyen mai
    Khuyenmai.hasMany(ChiTietKM, { as: 'ChiTietKM', foreignKey: 'IDKhuyenMai' });
    ChiTietKM.belongsTo(Khuyenmai, { as: 'R_KhuyenMai', foreignKey: 'IDKhuyenMai' });
    ChiTietKM.hasMany(Mon, { as: 'Mon', foreignKey: 'IDMon' });
    Mon.belongsTo(ChiTietKM, { as: 'R_KhuyenMai_Mon', foreignKey: 'IDMon' });
    //cong no khach hang
    CongNoKH.hasMany(ChiTietCongNoKH, { as: 'ChiTietCongNoKH', foreignKey: 'IDCongNoKH' });
    ChiTietCongNoKH.belongsTo(CongNoKH, { as: 'R_CongNo', foreignKey: 'IDCongNoKH' });
    ChiTietCongNoKH.hasMany(HoaDon, { as: 'HoaDon', foreignKey: 'IDHoaDon' });
    HoaDon.belongsTo(ChiTietCongNoKH, { as: 'R_CongNo_HoaDon', foreignKey: 'IDHoaDon' });

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
        ChiTietKM,
        CongNoKH,
        ChiTietCongNoKH,
    };
}
