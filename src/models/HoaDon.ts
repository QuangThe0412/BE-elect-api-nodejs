import { DataTypes, Model, Sequelize } from 'sequelize';

export interface HoaDonAttributes {
    IDHoaDon?: number;
    IDBaoGia?: number;
    IDKhachHang?: number;
    CongNo?: number;
    TrangThai?: number;
    GhiChu?: string;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
}

export class HoaDon extends Model<HoaDonAttributes> implements HoaDonAttributes {
    IDHoaDon?: number;
    IDBaoGia?: number;
    IDKhachHang?: number;
    CongNo?: number;
    TrangThai?: number; // 0: pending, 1: finish, 2: cancel
    GhiChu?: string;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
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
                    allowNull: true,
                },
                IDKhachHang: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                GhiChu: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                CongNo: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                },
                TrangThai: {
                    type: DataTypes.INTEGER,
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