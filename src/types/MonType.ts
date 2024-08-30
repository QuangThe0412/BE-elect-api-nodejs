import { Mon } from "@models/Mon";

export type MonRequestType = Mon & {
    idThongTin: number;
}

export type MonResponseType = Mon & {
    idThongTinMon: number;
    size: string;
    color: string;
}