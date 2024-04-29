import { DataTypes, Model, Sequelize } from 'sequelize';

export interface BannerAttributes {
    IdBanner?: number;
    Image?: string;
    Priority?: number;
    Deleted?: boolean;
    CreateDay?: Date;
    ModifyDay?: Date;
}

export class Banner extends Model<BannerAttributes> implements BannerAttributes {
    IdBanner?: number;
    Image?: string;
    Priority?: number;
    Deleted?: boolean;
    CreateDay?: Date;
    ModifyDay?: Date;

    static initModel(sequelize: Sequelize) {
        Banner.init(
            {
                IdBanner: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                Image: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                Priority: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                Deleted: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
                CreateDay: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
                ModifyDay: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                modelName: 'Banner',
                tableName: 'Banners',
                timestamps: false,
            }
        );
        return Banner;
    }
}