import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

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
  }
);

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