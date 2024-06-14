import { DataTypes, Model, Sequelize } from 'sequelize';

export interface NhomMonAttributes {
    IDNhomMon?: number;
    TenNhom?: string;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
}

export class NhomMon extends Model<NhomMonAttributes, NhomMonAttributes> implements NhomMonAttributes
{
    IDNhomMon?: number;
    TenNhom?: string;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;

    static initModel(sequelize: Sequelize) {
        NhomMon.init(
            {
                IDNhomMon: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    field: 'IDNhomMon',
                },
                TenNhom: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                createDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    field: 'createDate',
                },
                modifyDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    field: 'modifyDate',
                },
                createBy: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    field: 'createBy',
                },
                modifyBy: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    field: 'modifyBy',
                },
            },
            {
                sequelize,
                tableName: 'NhomMon',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'IDNhomMon' }],
                    },
                ],
            }
        );
        return NhomMon;
    }
}