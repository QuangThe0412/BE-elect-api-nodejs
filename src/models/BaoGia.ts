import { DataTypes, Model, Sequelize } from 'sequelize';

export interface BaoGiaAttributes {
    IDBaoGia?: number;
    IDKhachHang?: number;
    TotalMoney?: number;
    modifyDate?: Date;
    createBy?: string;
    modifyBy?: string;
    Deleted?: boolean;
}

export class BaoGia extends Model<BaoGiaAttributes> implements BaoGiaAttributes {
    IDBaoGia?: number;
    IDKhachHang?: number;
    TotalMoney?: number;
    modifyDate?: Date;
    createDate?: Date;
    createBy?: string;
    modifyBy?: string;
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
                modelName: 'BaoGia',
                tableName: 'BaoGia',
                timestamps: false,
            }
        );
        return BaoGia;
    }
}