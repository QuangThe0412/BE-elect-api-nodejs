import { DataTypes, Model, Sequelize } from 'sequelize';

export interface BannerAttributes {
    IdBanner?: number;
    Image?: string;
    Priority?: number;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
    Deleted?: boolean;
}

export class Banner extends Model<BannerAttributes> implements BannerAttributes {
    IdBanner?: number;
    Image?: string;
    Priority?: number;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
    Deleted?: boolean;

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
                modelName: 'Banner',
                tableName: 'Banners',
                timestamps: false,
            }
        );
        return Banner;
    }
}