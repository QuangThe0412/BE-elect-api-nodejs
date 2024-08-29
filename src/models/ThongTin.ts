import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ThongTinAttributes {
    Id?: number;
    size?: string;
    color?: string;
    Deleted?: boolean;
}

export class ThongTin
    extends Model<ThongTinAttributes, ThongTinAttributes>
    implements ThongTinAttributes {
    Id?: number;
    size?: string;
    color?: string;
    Deleted?: boolean;

    static initModel(sequelize: Sequelize) {
        ThongTin.init(
            {
                Id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    field: 'Id',
                },
                size: {
                    type: DataTypes.STRING(150),
                    allowNull: true,
                },
                color: {
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
                tableName: 'ThongTin',
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
        return ThongTin;
    }
}