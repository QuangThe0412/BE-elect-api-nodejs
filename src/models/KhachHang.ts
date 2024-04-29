import { DataTypes, Model, Sequelize } from 'sequelize';

export interface KhachHangAttributes {
    IDKhachHang?: number;
    MaKhachHang?: string;
    TenKhachHang?: string;
    DiaChiKH?: string;
    DienThoai?: string;
    Email?: string;
    SoTaiKhoan?: string;
    IDLoaiKH?: number;
    ThongTinKhac?: string;
    NgayTao?: Date;
    NgaySua?: Date;
    Deleted?: boolean;
}

export class KhachHang extends Model<KhachHangAttributes> implements KhachHangAttributes {
    IDKhachHang?: number;
    MaKhachHang?: string;
    TenKhachHang?: string;
    DiaChiKH?: string;
    DienThoai?: string;
    Email?: string;
    SoTaiKhoan?: string;
    IDLoaiKH?: number;
    ThongTinKhac?: string;
    NgayTao?: Date;
    NgaySua?: Date;
    Deleted?: boolean;

    static initModel(sequelize: Sequelize) {
        KhachHang.init(
            {
                IDKhachHang: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                MaKhachHang: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                TenKhachHang: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                DiaChiKH: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                DienThoai: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                Email: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                SoTaiKhoan: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                IDLoaiKH: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                ThongTinKhac: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                NgayTao: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
                NgaySua: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                Deleted: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
            },
            {
                sequelize,
                modelName: 'KhachHang',
                tableName: 'KhachHang',
                timestamps: false,
            }
        );
        return KhachHang;
    }
}