import { DataTypes, Model, Sequelize } from 'sequelize';

export interface PhieuXuatAttributes {
    IDPhieuXuat?: number;
    NgayXuat?: Date;
    IDKhachHang?: number;
    TongGiaTri?: number;
    TenNhanVien?: string;
    GhiChuXuat?: string;
    Deleted?: boolean;
}

export class PhieuXuat extends Model<PhieuXuatAttributes> implements PhieuXuatAttributes {
    IDPhieuXuat?: number;
    NgayXuat?: Date;
    IDKhachHang?: number;
    TongGiaTri?: number;
    TenNhanVien?: string;
    GhiChuXuat?: string;
    Deleted?: boolean;

    static initModel(sequelize: Sequelize) {
        PhieuXuat.init(
            {
                IDPhieuXuat: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                NgayXuat: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
                IDKhachHang: {
                    type: DataTypes.INTEGER,
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
                GhiChuXuat: {
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
                modelName: 'PhieuXuat',
                tableName: 'PhieuXuat',
                timestamps: false,
            }
        );
        return PhieuXuat;
    }
}