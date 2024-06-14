import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { Connection } from 'tedious';

dotenv.config({ path: path.resolve(`.env`) });

const config = process.env;

const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    port: parseInt(process.env.DB_PORT || '1433'),
    dialect: 'mssql',
    dialectOptions: {
      multipleStatements: true,
    },
    query: {
      raw: true,
    },
    define: {
      timestamps: false,
    },
    database: config.DB_NAME,
    logging: console.log
  }
);

// const sequelize = new Sequelize('SmartShop_dev', {
//   dialect: 'mssql',
//   dialectModule: Connection,
//   dialectOptions: {
//     authentication: {
//       type: 'ntlm',
//       options: {
//         domain: 'DESKTOP-VHA3BPP',
//         userName: 'quang',
//       },
//     },
//     options: {
//       instanceName: 'SQLEXPRESS',
//       trustedConnection: true,
//       enableArithAbort: true,
//       encrypt: false,
//     },
//   },
//   define: {
//     timestamps: false,
//   },
//   logging: console.log,
// });

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection Started');
  })
  .catch((err: any) => {
    console.log(err);
    throw err;
  });

export const sequelizeInstance = sequelize;