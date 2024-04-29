import { DataTypes, Model, Sequelize } from 'sequelize';

export interface HoaDonAttributes {
    IDHoaDon?: number;
    IDBaoGia?: number;
    IDKhachHang?: number;
    NgayLap?: Date;
    GhiChu?: string;
    CongNo?: number;
}

export class HoaDon extends Model<HoaDonAttributes> implements HoaDonAttributes {
    IDHoaDon?: number;
    IDBaoGia?: number;
    IDKhachHang?: number;
    NgayLap?: Date;
    GhiChu?: string;
    CongNo?: number;

    static initModel(sequelize: Sequelize) {
        HoaDon.init(
            {
                IDHoaDon: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                IDBaoGia: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                IDKhachHang: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                NgayLap: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
                GhiChu: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                CongNo: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: 'HoaDon',
                tableName: 'HoaDon',
                timestamps: false,
            }
        );
        return HoaDon;
    }
}