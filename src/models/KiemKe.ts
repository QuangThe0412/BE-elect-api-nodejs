import { DataTypes, Model, Sequelize } from 'sequelize';

export interface KiemKeAttributes {
    IDMon: number;
    Ngay: Date;
    SLTonDau: number;
    SLNhap: number;
    SLXuat: number;
    SLTonCuoi: number;
    SLKiemKe: number;
    DonGiaKK: number;
    TrangThai: number; // 0: Pending, 1: Finish, 2: Cancel
}

export class KiemKe extends Model<KiemKeAttributes> implements KiemKeAttributes {
    IDMon!: number;
    Ngay!: Date;
    SLTonDau!: number;
    SLNhap!: number;
    SLXuat!: number;
    SLTonCuoi!: number;
    SLKiemKe!: number;
    DonGiaKK!: number;
    TrangThai!: number;

    static initModel(sequelize: Sequelize) {
        KiemKe.init(
            {
                IDMon: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                },
                Ngay: {
                    type: DataTypes.DATE,
                    allowNull: false,
                },
                SLTonDau: {
                    type: DataTypes.DECIMAL(18, 2),
                    allowNull: false,
                },
                SLNhap: {
                    type: DataTypes.DECIMAL(18, 2),
                    allowNull: false,
                },
                SLXuat: {
                    type: DataTypes.DECIMAL(18, 2),
                    allowNull: false,
                },
                SLTonCuoi: {
                    type: DataTypes.DECIMAL(18, 2),
                    allowNull: false,
                },
                SLKiemKe: {
                    type: DataTypes.DECIMAL(18, 2),
                    allowNull: false,
                },
                DonGiaKK: {
                    type: DataTypes.DECIMAL(18, 5),
                    allowNull: false,
                },
                TrangThai: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
            },
            {
                sequelize,
                modelName: 'KiemKe',
                tableName: 'KiemKe',
                timestamps: false,
            }
        );
        return KiemKe;
    }
}