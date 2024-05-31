import { DataTypes, Model, Sequelize } from 'sequelize';

export interface BaoGiaChiTietAttributes {
    IDBGCT?: number;
    IDBaoGia?: number;
    IDSanPham?: number;
    MaTat?: string;
    TenKhachHang?: string;
    TenSanPham?: string;
    DonViTinh?: string;
    SoLuong?: number;
    DonGia?: number;
    ChietKhau?: number;
    TienChuaCK?: number;
    SoTienCK?: number;
    TienSauCK?: number;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string;
    modifyBy?: string;
    Deleted?: boolean;
}

export class BaoGiaChiTiet extends Model<BaoGiaChiTietAttributes> implements BaoGiaChiTietAttributes {
    IDBGCT?: number;
    IDBaoGia?: number;
    IDSanPham?: number;
    MaTat?: string;
    TenKhachHang?: string;
    TenSanPham?: string;
    DonViTinh?: string;
    SoLuong?: number;
    DonGia?: number;
    ChietKhau?: number;
    TienChuaCK?: number;
    SoTienCK?: number;
    TienSauCK?: number;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string;
    modifyBy?: string;
    Deleted?: boolean;

    static initModel(sequelize: Sequelize) {
        BaoGiaChiTiet.init(
            {
                IDBGCT: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                IDBaoGia: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                IDSanPham: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                MaTat: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                TenKhachHang: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                TenSanPham: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                DonViTinh: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                SoLuong: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                DonGia: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                ChietKhau: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                TienChuaCK: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                SoTienCK: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                TienSauCK: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                createdDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                modifyDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                createdBy: {
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
                modelName: 'BaoGiaChiTiet',
                tableName: 'BaoGiaChiTiet',
                timestamps: false,
            }
        );
        return BaoGiaChiTiet;
    }
}