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
    createdDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
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
    createdDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
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
                    allowNull: true,
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
                    allowNull: true,
                },
                ThongTinKhac: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                createdDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                modifyDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                createBy: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                modifyBy: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                Deleted: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
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