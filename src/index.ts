import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
//this set ENV variables from .env file
dotenv.config({ path: path.resolve(`.env`) });
import connectToDb from './db';
import {monRouter} from './routes';

const app = express();
const port = process.env.PORT || 3000;

connectToDb().then(() => {
  // Use your routes here
  app.use('/mon', monRouter);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

export default app;