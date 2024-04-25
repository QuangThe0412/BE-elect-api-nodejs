import { DataTypes, Model, Sequelize } from 'sequelize';

export interface LoaiMonAttributes {
    IDLoaiMon?: number;
    IDNhomMon?: number;
    TenLoai?: string;
    Deleted?: boolean;
}

export class LoaiMon extends Model<LoaiMonAttributes> implements LoaiMonAttributes {
    IDLoaiMon?: number;
    IDNhomMon?: number;
    TenLoai?: string;
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
                Deleted: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false, // Set default value
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


