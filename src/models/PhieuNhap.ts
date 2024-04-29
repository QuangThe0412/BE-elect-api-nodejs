import { DataTypes, Model, Sequelize } from 'sequelize';

export interface PhieuNhapAttributes {
    IDPhieuNhap?: number;
    NgayNhap?: Date;
    NhaCungCap?: string;
    TongGiaTri?: number;
    TenNhanVien?: string;
    GhiChuNhap?: string;
    Deleted?: boolean;
}

export class PhieuNhap extends Model<PhieuNhapAttributes> implements PhieuNhapAttributes {
    IDPhieuNhap?: number;
    NgayNhap?: Date;
    NhaCungCap?: string;
    TongGiaTri?: number;
    TenNhanVien?: string;
    GhiChuNhap?: string;
    Deleted?: boolean;

    static initModel(sequelize: Sequelize) {
        PhieuNhap.init(
            {
                IDPhieuNhap: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                NgayNhap: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
                NhaCungCap: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                TongGiaTri: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                TenNhanVien: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                GhiChuNhap: {
                    type: DataTypes.STRING,
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
                modelName: 'PhieuNhap',
                tableName: 'PhieuNhap',
                timestamps: false,
            }
        );
        return PhieuNhap;
    }
}