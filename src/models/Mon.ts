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
  VAT?: number;
  ThoiGianBH?: number;
  GhiChu?: string;
  NgayTao?: Date;
  NgaySua?: Date;
  Deleted?: number;
}

export class Mon
  extends Model<MonAttributes, MonAttributes>
  implements MonAttributes {
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
  VAT?: number;
  ThoiGianBH?: number;
  GhiChu?: string;
  NgayTao?: Date;
  NgaySua?: Date;
  Deleted?: number;

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
        },
        DonGiaBanLe: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        DonGiaVon: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        SoLuongTonKho: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        VAT: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        ThoiGianBH: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        GhiChu: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        NgayTao: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'NgayTao',
        },
        NgaySua: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'NgaySua',
        },
        Deleted: {
          type: DataTypes.INTEGER,
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