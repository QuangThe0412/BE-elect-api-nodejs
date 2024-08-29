import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ThongTinMonAttributes {
    Id?: number;
    IdThongTin?: number;
    IdMon?: number;
    DonGiaBanSi?: number;
    DonGiaBanLe?: number;
    DonGiaVon?: number;
    Deleted?: boolean;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
}

export class ThongTinMon
    extends Model<ThongTinMonAttributes, ThongTinMonAttributes>
    implements ThongTinMonAttributes {
    Id?: number;
    IdThongTin?: number;
    IdMon?: number;
    DonGiaBanSi?: number;
    DonGiaBanLe?: number;
    DonGiaVon?: number;
    Deleted?: boolean;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;

    static initModel(sequelize: Sequelize) {
        ThongTinMon.init(
            {
                Id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    field: 'Id',
                },
                IdThongTin: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                IdMon: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                DonGiaBanSi: {
                    type: DataTypes.DECIMAL(18, 0),
                    allowNull: true,
                },
                DonGiaBanLe: {
                    type: DataTypes.DECIMAL(18, 0),
                    allowNull: true,
                },
                DonGiaVon: {
                    type: DataTypes.DECIMAL(18, 0),
                    allowNull: true,
                },
                Deleted: {
                    type: DataTypes.BOOLEAN,
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
            },
            {
                sequelize,
                tableName: 'ThongTinMon',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'Id' }],
                    },
                ],
            }
        );
        return ThongTinMon;
    }
}