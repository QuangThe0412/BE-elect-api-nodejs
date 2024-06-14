import { DataTypes, Model, Sequelize } from 'sequelize';

export interface KhuyenmaiAttributes {
    IDKhuyenMai?: number;
    TenKhuyenMai?: string;
    IdLoaiKH?: number;
    TuNgay: Date;
    DenNgay: Date;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
    Deleted?: boolean;
}

export class Khuyenmai extends Model<KhuyenmaiAttributes> implements KhuyenmaiAttributes {
    IDKhuyenMai?: number;
    TenKhuyenMai?: string;
    IdLoaiKH?: number;
    TuNgay: Date;
    DenNgay: Date;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
    Deleted?: boolean;

    static initModel(sequelize: Sequelize) {
        Khuyenmai.init(
            {
                IDKhuyenMai: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                TenKhuyenMai: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                IdLoaiKH: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                TuNgay: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                DenNgay: {
                    type: DataTypes.DATE,
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
                    type: DataTypes.STRING(150),
                    allowNull: true,
                },
                modifyBy: {
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
                modelName: 'Khuyenmai',
                tableName: 'Khuyenmai',
                timestamps: false,
            }
        );
        return Khuyenmai;
    }
}