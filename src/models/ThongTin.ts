import { DataTypes, Model, Sequelize } from 'sequelize';

export interface ThongTinAttributes {
    Id?: number;
    Size?: string;
    Color?: string;
    Deleted?: boolean;
}

export class ThongTin
    extends Model<ThongTinAttributes, ThongTinAttributes>
    implements ThongTinAttributes {
    Id?: number;
    Size?: string;
    Color?: string;
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
                Size: {
                    type: DataTypes.STRING(150),
                    allowNull: true,
                },
                Color: {
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