import { DataTypes, Model, Sequelize } from 'sequelize';

export interface BaoGiaAttributes {
    IDBaoGia?: number;
    IDKhachHang?: number;
    TotalMoney?: number;
    NgayLap?: Date;
    NgaySua?: Date;
    Deleted?: boolean;
}

export class BaoGia extends Model<BaoGiaAttributes> implements BaoGiaAttributes {
    IDBaoGia?: number;
    IDKhachHang?: number;
    TotalMoney?: number;
    NgayLap?: Date;
    NgaySua?: Date;
    Deleted?: boolean;

    static initModel(sequelize: Sequelize) {
        BaoGia.init(
            {
                IDBaoGia: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                IDKhachHang: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                TotalMoney: {
                    type: DataTypes.FLOAT,
                    allowNull: false,
                },
                NgayLap: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: DataTypes.NOW,
                },
                NgaySua: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                Deleted: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: false,
                },
            },
            {
                sequelize,
                modelName: 'BaoGia',
                tableName: 'BaoGia',
                timestamps: false,
            }
        );
        return BaoGia;
    }
}