import { DataTypes, Model, Sequelize, DATE } from 'sequelize';

DATE.prototype._stringify = function _stringify(date: any, options: any) {
  date = this._applyTimezone(date, options);
  return date.format('YYYY-MM-DD HH:mm:ss.SSS');
};

export interface AdminAttributes {
  id?: number;
  username?: string;
  password?: string;
  phone?: string;
  store?: string;
  admin?: boolean;
  cashier?: boolean;
  saler?: boolean;
  inventory?: boolean;
  createDate?: Date;
  modifyDate?: Date;
  Deleted?: boolean;
}

export class Admin extends Model<AdminAttributes, AdminAttributes> implements AdminAttributes {
  id?: number;
  username?: string;
  password?: string;
  phone?: string;
  store?: string;
  admin?: boolean;
  cashier?: boolean;
  saler?: boolean;
  inventory?: boolean;
  createDate?: Date;
  modifyDate?: Date;
  Deleted?: boolean;

  static initModel(sequelize: Sequelize) {
    Admin.init(
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
        store: {
          type: DataTypes.STRING,
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
        createDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        modifyDate: {
          type: DataTypes.DATE,
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
        tableName: 'Admin',
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
    return Admin;
  }
}