import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ChiTietHDAttributes {
    IDChiTietHD?: number;
    IDHoaDon?: number;
    IDMon?: number;
    SoLuong?: number;
    DonGia?: number;
    ChietKhau?: number;
    TienChuaCK?: number;
    TienCK?: number;
    TienSauCK?: number;
    Deleted?: boolean;
}

export class ChiTietHD extends Model<ChiTietHDAttributes> implements ChiTietHDAttributes {
    IDChiTietHD?: number;
    IDHoaDon?: number;
    IDMon?: number;
    SoLuong?: number;
    DonGia?: number;
    ChietKhau?: number;
    TienChuaCK?: number;
    TienCK?: number;
    TienSauCK?: number;
    Deleted?: boolean;

    static initModel(sequelize: Sequelize) {
        ChiTietHD.init(
            {
                IDChiTietHD: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                IDHoaDon: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                IDMon: {
                    type: DataTypes.INTEGER,
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
                TienCK: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                TienSauCK: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                Deleted: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
            },
            {
                sequelize,
                modelName: 'ChiTietHD',
                tableName: 'ChiTietHD',
                timestamps: false,
            }
        );
        return ChiTietHD;
    }
}