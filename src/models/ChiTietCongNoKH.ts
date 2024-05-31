import { DataTypes, Model, Sequelize } from 'sequelize';
import { CongNoKH } from './CongNoKH';

export interface ChiTietCongNoKHAttributes {
    idChiTietCongNoKH?: number;
    idCongNoKH?: number;
    NgayTra?: Date;
    SoTienTra?: number;
    CongNoCuoi?: number;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
}

export class ChiTietCongNoKH extends Model<ChiTietCongNoKHAttributes> implements ChiTietCongNoKHAttributes {
    idChiTietCongNoKH?: number;
    idCongNoKH?: number;
    NgayTra?: Date;
    SoTienTra?: number;
    CongNoCuoi?: number;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;

    static initModel(sequelize: Sequelize) {
        ChiTietCongNoKH.init(
            {
                idChiTietCongNoKH: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                idCongNoKH: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                NgayTra: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                SoTienTra: {
                    type: DataTypes.DECIMAL(18),
                    allowNull: true,
                },
                CongNoCuoi: {
                    type: DataTypes.DECIMAL(18),
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
                modelName: 'ChiTietCongNoKH',
                tableName: 'ChiTietCongNoKH',
                timestamps: false,
            }
        );

        ChiTietCongNoKH.belongsTo(CongNoKH, { foreignKey: 'idCongNoKH' });

        return ChiTietCongNoKH;
    }
}