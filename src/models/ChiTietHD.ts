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
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
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
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
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
                    allowNull: true,
                },
                SoLuong: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                DonGia: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                ChietKhau: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                TienChuaCK: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                TienCK: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                TienSauCK: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                createDate: {
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
                modelName: 'ChiTietHD',
                tableName: 'ChiTietHD',
                timestamps: false,
            }
        );
        return ChiTietHD;
    }
}