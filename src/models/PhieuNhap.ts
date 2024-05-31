import { DataTypes, Model, Sequelize } from 'sequelize';

export interface PhieuNhapAttributes {
    IDPhieuNhap?: number;
    NgayNhap?: Date;
    NhaCungCap?: string;
    TongGiaTri?: number;
    GhiChu?: string;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
    Deleted?: boolean;
}

export class PhieuNhap extends Model<PhieuNhapAttributes> implements PhieuNhapAttributes {
    IDPhieuNhap?: number;
    NgayNhap?: Date;
    NhaCungCap?: string;
    TongGiaTri?: number;
    GhiChu?: string;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
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
                GhiChu: {
                    type: DataTypes.STRING,
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
                modelName: 'PhieuNhap',
                tableName: 'PhieuNhap',
                timestamps: false,
            }
        );
        return PhieuNhap;
    }
}