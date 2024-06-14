import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ChiTietPhieuNhapAttributes {
    IDChiTietPhieuNhap?: number;
    IDPhieuNhap?: number;
    IDMon?: number;
    SoLuongNhap?: number;
    DonGiaNhap?: number;
    ChietKhau?: number;
    ThanhTien?: number;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
    Deleted?: boolean;
}

export class ChiTietPhieuNhap extends Model<ChiTietPhieuNhapAttributes> implements ChiTietPhieuNhapAttributes {
    IDChiTietPhieuNhap?: number;
    IDPhieuNhap?: number;
    IDMon?: number;
    SoLuongNhap?: number;
    DonGiaNhap?: number;
    ChietKhau?: number;
    ThanhTien?: number;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
    Deleted?: boolean;

    static initModel(sequelize: Sequelize) {
        ChiTietPhieuNhap.init(
            {
                IDChiTietPhieuNhap: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                IDPhieuNhap: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                IDMon: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                SoLuongNhap: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                DonGiaNhap: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                ChietKhau: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                ThanhTien: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
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
                modelName: 'ChiTietPhieuNhap',
                tableName: 'ChiTietPhieuNhap',
                timestamps: false,
            }
        );
        return ChiTietPhieuNhap;
    }
}