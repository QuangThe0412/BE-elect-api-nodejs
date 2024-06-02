import { DataTypes, Model, Sequelize } from 'sequelize';

export interface KhachHangAttributes {
    IDKhachHang?: number;
    IDLoaiKH?: number;
    TenKhachHang?: string;
    username?: string;
    password?: string;
    DienThoai?: string;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
    Deleted?: boolean;
}

export class KhachHang extends Model<KhachHangAttributes> implements KhachHangAttributes {
    IDKhachHang?: number;
    IDLoaiKH?: number;
    TenKhachHang?: string;
    DienThoai?: string;
    username?: string;
    password?: string;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
    Deleted?: boolean;

    static initModel(sequelize: Sequelize) {
        KhachHang.init(
            {
                IDKhachHang: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                TenKhachHang: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                DienThoai: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                username: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                IDLoaiKH: {
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
                Deleted: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                },      
            },
            {
                sequelize,
                modelName: 'KhachHang',
                tableName: 'KhachHang',
                timestamps: false,
            }
        );
        return KhachHang;
    }
}