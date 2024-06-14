import { DataTypes, Model, Sequelize } from 'sequelize';
import { HoaDon } from './HoaDon';
import { KhachHang } from './KhachHang';

export interface CongNoKHAttributes {
    Id?: number;
    IDKhachHang?: number;
    IDHoaDon?: number;
    CongNoDau?: number;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
}

export class CongNoKH extends Model<CongNoKHAttributes> implements CongNoKHAttributes {
    Id?: number;
    IDKhachHang?: number;
    IDHoaDon?: number;
    CongNoDau?: number;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;

    static initModel(sequelize: Sequelize) {
        CongNoKH.init(
            {
                Id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                IDKhachHang: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                IDHoaDon: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                CongNoDau: {
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
                modelName: 'CongNoKH',
                tableName: 'CongNoKH',
                timestamps: false,
            }
        );

        CongNoKH.belongsTo(HoaDon, { foreignKey: 'IDHoaDon' });
        CongNoKH.belongsTo(KhachHang, { foreignKey: 'IDKhachHang' });

        return CongNoKH;
    }
}