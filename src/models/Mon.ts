import { DataTypes, Model, Sequelize } from 'sequelize';

export interface MonAttributes {
  IDMon?: number;
  IDLoaiMon?: number;
  TenMon?: string;
  TenKhongDau?: string;
  MaTat?: string;
  Image?: string;
  DVTMon?: string;
  DonGiaBanSi?: number;
  DonGiaBanLe?: number;
  DonGiaVon?: number;
  SoLuongTonKho?: number;
  ThoiGianBH?: number;
  GhiChu?: string;
  createDate?: Date;
  modifyDate?: Date;
  createBy?: string;
  modifyBy?: string;
  Deleted?: boolean;
}

export class Mon
  extends Model<MonAttributes, MonAttributes>
  implements MonAttributes {
  IDMon?: number;
  IDLoaiMon?: number;
  TenMon?: string;
  TenKhongDau?: string;
  Image?: string;
  MaTat?: string;
  DVTMon?: string;
  DonGiaBanSi?: number;
  DonGiaBanLe?: number;
  DonGiaVon?: number;
  SoLuongTonKho?: number;
  ThoiGianBH?: number;
  GhiChu?: string;
  createDate?: Date;
  modifyDate?: Date;
  createBy?: string;
  modifyBy?: string;
  Deleted?: boolean;

  static initModel(sequelize: Sequelize) {
    Mon.init(
      {
        IDMon: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          field: 'IDMon',
        },
        IDLoaiMon: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        TenMon: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        TenKhongDau: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        MaTat: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        Image: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        DVTMon: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        DonGiaBanSi: {
          type: DataTypes.FLOAT,
          allowNull: true,
          defaultValue: 0,
        },
        DonGiaBanLe: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        DonGiaVon: {
          type: DataTypes.FLOAT,
          allowNull: true,
          defaultValue: 0,
        },
        SoLuongTonKho: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        ThoiGianBH: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
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
        tableName: 'Mon',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'IDMon' }],
          },
        ],
      }
    );
    return Mon;
  }
}