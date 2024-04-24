import connectToDb from '../db';

export interface Mon {
  IDMon: number;
  IDLoaiMon: number;
  TenMon: string;
  TenKhongDau: string;
  MaTat: string;
  Image: string;
  DVTMon: string;
  DonGiaBanSi: number;
  DonGiaBanLe: number;
  DonGiaVon: number;
  SoLuongTonKho: number;
  VAT: number;
  ThoiGianBH: number;
  GhiChu: string;
  NgayTao: Date;
  NgaySua: Date;
  Deleted: number;
}

export const getMons = async (): Promise<Mon[]> => {
  try {
    const pool = await connectToDb();
    const result = await pool.request().query('SELECT * FROM Mon');
    return result.recordset as Mon[];
  } catch (err) {
    console.error(err);
    return [];
  }
};