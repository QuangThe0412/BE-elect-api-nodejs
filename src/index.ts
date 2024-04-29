import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { sequelizeInstance } from './db/index';
//this set ENV variables from .env file
dotenv.config({ path: path.resolve(`.env`) });
import { initModels } from './models/init-models';
import adminRouter from './routes/admin';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initModels(sequelizeInstance);

app.use('/admin', adminRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;