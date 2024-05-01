import { DataTypes, Model, Sequelize, DATE } from 'sequelize';

DATE.prototype._stringify = function _stringify(date: any, options: any) {
  date = this._applyTimezone(date, options);
  return date.format('YYYY-MM-DD HH:mm:ss.SSS');
};

export interface NguoiDungAttributes {
  id?: number;
  username?: string;
  password?: string;
  phone?: string;
  email?: string;
  createDate?: Date;
  modifyDate?: Date;
  Deleted?: boolean;
}

export class NguoiDung extends Model<NguoiDungAttributes> implements NguoiDungAttributes {
  id?: number;
  username?: string;
  password?: string;
  phone?: string;
  email?: string;
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
        email: {
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