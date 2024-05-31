import { DataTypes, Model, Sequelize } from 'sequelize';

export interface PhieuXuatAttributes {
    IDPhieuXuat?: number;
    IDKhachHang?: number;
    TongGiaTri?: number;
    GhiChu?: string;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
    Deleted?: boolean;
}

export class PhieuXuat extends Model<PhieuXuatAttributes> implements PhieuXuatAttributes {
    IDPhieuXuat?: number;
    NgayXuat?: Date;
    IDKhachHang?: number;
    TongGiaTri?: number;
    GhiChu?: string;
    createDate?: Date;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
    Deleted?: boolean;

    static initModel(sequelize: Sequelize) {
        PhieuXuat.init(
            {
                IDPhieuXuat: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },                
                IDKhachHang: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                TongGiaTri: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                GhiChu: {
                    type: DataTypes.STRING,
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
                modelName: 'PhieuXuat',
                tableName: 'PhieuXuat',
                timestamps: false,
            }
        );
        return PhieuXuat;
    }
}