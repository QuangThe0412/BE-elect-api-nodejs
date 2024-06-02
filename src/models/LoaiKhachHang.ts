import { DataTypes, Model, Sequelize } from 'sequelize';

export interface LoaiKhachHangAttributes {
    IDLoaiKH: number;
    TenLoaiKH: string;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
}

export class LoaiKhachHang extends Model<LoaiKhachHangAttributes> implements LoaiKhachHangAttributes {
    IDLoaiKH: number;
    TenLoaiKH: string;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;

    static initModel(sequelize: Sequelize) {
        LoaiKhachHang.init(
            {
                IDLoaiKH: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                TenLoaiKH: {
                    type: DataTypes.STRING,
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
            },
            {
                sequelize,
                tableName: 'LoaiKhachHang',
                timestamps: false,
            }
        );
        return LoaiKhachHang;
    }
}