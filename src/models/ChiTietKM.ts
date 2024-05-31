import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ChiTietKMAttributes {
    IDChiTietKM?: number;
    IDKhuyenMai?: number;
    IDMon?: number;
    PhanTramKM?: number;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
    Deleted?: boolean;
}

export class ChiTietKM extends Model<ChiTietKMAttributes> implements ChiTietKMAttributes {
    IDChiTietKM?: number;
    IDKhuyenMai?: number;
    IDMon?: number;
    PhanTramKM?: number;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
    Deleted?: boolean;

    static initModel(sequelize: Sequelize) {
        ChiTietKM.init(
            {
                IDChiTietKM: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                IDKhuyenMai: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                IDMon: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                PhanTramKM: {
                    type: DataTypes.DECIMAL(18, 2),
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
                    type: DataTypes.STRING(150),
                    allowNull: true,
                },
                modifyBy: {
                    type: DataTypes.STRING(150),
                    allowNull: true,
                },
                Deleted: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                },    
            },
            {
                sequelize,
                modelName: 'ChiTietKM',
                tableName: 'ChiTietKM',
                timestamps: false,
            }
        );
        return ChiTietKM;
    }
}