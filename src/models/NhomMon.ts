import { DataTypes, Model, Sequelize } from 'sequelize';

export interface NhomMonAttributes {
    IDNhomMon?: number;
    TenNhom?: string;
}

export class NhomMon extends Model<NhomMonAttributes, NhomMonAttributes> implements NhomMonAttributes
{
    IDNhomMon?: number;
    TenNhom?: string;

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