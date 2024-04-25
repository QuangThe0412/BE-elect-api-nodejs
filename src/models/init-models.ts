import { Sequelize } from 'sequelize';
import { Mon, MonAttributes } from './Mon';
import { NhomMon, NhomMonAttributes } from './NhomMon';
import { LoaiMon, LoaiMonAttributes } from './LoaiMon';
export {
    Mon as Mon,
    MonAttributes as MonAttributes,
    NhomMon as NhomMon,
    NhomMonAttributes as NhomMonAttributes,
    LoaiMon as LoaiMon,
    LoaiMonAttributes as LoaiMonAttributes,
};

export function initModels(sequelize: Sequelize) {
    Mon.initModel(sequelize);
    NhomMon.initModel(sequelize);
    LoaiMon.initModel(sequelize);
    return {
        Mon,
        NhomMon,
        LoaiMon,
    };
}
