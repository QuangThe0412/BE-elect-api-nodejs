import { DataTypes, Model, Sequelize } from 'sequelize';

export interface LoaiMonAttributes {
    IDLoaiMon?: number;
    IDNhomMon?: number;
    TenLoai?: string;
    createdDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
    Deleted?: boolean;
}

export class LoaiMon extends Model<LoaiMonAttributes> implements LoaiMonAttributes {
    IDLoaiMon?: number;
    IDNhomMon?: number;
    TenLoai?: string;
    createdDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
    Deleted?: boolean;

    static initModel(sequelize: Sequelize) {
        LoaiMon.init(
            {
                IDLoaiMon: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                IDNhomMon: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                TenLoai: {
                    type: DataTypes.STRING,
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
                modelName: 'LoaiMon',
                tableName: 'LoaiMon',
                timestamps: false,
            }
        );
        return LoaiMon;
    }
}


