import { DataTypes, Model, Sequelize } from 'sequelize';

export interface HoaDonAttributes {
    IDHoaDon?: number;
    IDBaoGia?: number;
    IDKhachHang?: number;
    NgayLap?: Date;
    CongNo?: number;
    TrangThai?: number;
    GhiChu?: string;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string;
    modifyBy?: string;
}

export class HoaDon extends Model<HoaDonAttributes> implements HoaDonAttributes {
    IDHoaDon?: number;
    IDBaoGia?: number;
    IDKhachHang?: number;
    NgayLap?: Date;
    CongNo?: number;
    TrangThai?: number; // 0: pending, 1: finish, 2: cancel
    GhiChu?: string;
    createdDate?: Date;
    modifyDate?: Date;
    createdBy?: string;
    modifyBy?: string;

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
                TrangThai: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                createdDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                modifyDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                createdBy: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                modifyBy: {
                    type: DataTypes.STRING,
                    allowNull: true,
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