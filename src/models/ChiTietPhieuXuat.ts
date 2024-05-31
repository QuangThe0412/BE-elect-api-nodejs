import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ChiTietPhieuXuatAttributes {
    IDChiTietPhieuXuat?: number;
    IDPhieuXuat?: number;
    IDMon?: number;
    SoLuongXuat?: number;
    DonGiaXuat?: number;
    ChietKhau?: number;
    ThanhTien?: number;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string;
    modifyBy?: string;
    Deleted?: boolean;
}

export class ChiTietPhieuXuat extends Model<ChiTietPhieuXuatAttributes> implements ChiTietPhieuXuatAttributes {
    IDChiTietPhieuXuat?: number;
    IDPhieuXuat?: number;
    IDMon?: number;
    SoLuongXuat?: number;
    DonGiaXuat?: number;
    ChietKhau?: number;
    ThanhTien?: number;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string;
    modifyBy?: string;
    Deleted?: boolean;

    static initModel(sequelize: Sequelize) {
        ChiTietPhieuXuat.init(
            {
                IDChiTietPhieuXuat: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                IDPhieuXuat: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                IDMon: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                SoLuongXuat: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                DonGiaXuat: {
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
                modelName: 'ChiTietPhieuXuat',
                tableName: 'ChiTietPhieuXuat',
                timestamps: false,
            }
        );
        return ChiTietPhieuXuat;
    }
}