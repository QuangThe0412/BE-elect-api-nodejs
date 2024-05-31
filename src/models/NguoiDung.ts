import { DataTypes, Model, Sequelize } from 'sequelize';

export interface NguoiDungAttributes {
  id?: number;
  username?: string;
  password?: string;
  phone?: string;
  ngaySinh?: Date;
  admin?: boolean;
  cashier?: boolean;
  saler?: boolean;
  inventory?: boolean;
  guest?: boolean;
  createDate?: Date;
  modifyDate?: Date;
  createBy?: string;
  modifyBy?: string;
  Deleted?: boolean;
}

export class NguoiDung extends Model<NguoiDungAttributes> implements NguoiDungAttributes {
  id?: number;
  username?: string;
  password?: string;
  phone?: string;
  admin?: boolean;
  cashier?: boolean;
  saler?: boolean;
  inventory?: boolean;
  guest?: boolean;
  ngaySinh?: Date;  
  createBy?: string;
  modifyBy?: string;
  createDate?: Date;
  modifyDate?: Date;
  Deleted?: boolean;

  static initModel(sequelize: Sequelize) {
    NguoiDung.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        ngaySinh: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        admin: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        cashier: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        saler: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        inventory: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        guest: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
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
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: 'NguoiDung',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
        ],
      }
    );
    return NguoiDung;
  }
}