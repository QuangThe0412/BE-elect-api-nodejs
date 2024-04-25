import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { sequelizeInstance } from './db/index';
//this set ENV variables from .env file
dotenv.config({ path: path.resolve(`.env`) });
import { initModels } from './models/init-models';
import { 
  monRouter,
  nhomMonRouter,
  loaiMonRouter
 } from './routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initModels(sequelizeInstance);

app.use('/mon', monRouter);
app.use('/nhomMon', nhomMonRouter);
app.use('/loaiMon', loaiMonRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;