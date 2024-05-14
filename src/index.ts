import express, {
  NextFunction,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

import cors from 'cors';
import { sequelizeInstance } from './db/index';
import { initModels } from './models/init-models';
import adminRouter from './routes/admin';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';

const corsOptions = {
  allowedHeaders: ['authorization', 'Content-Type'], // you can change the headers
  exposedHeaders: ['authorization'], // you can change the headers
  origin:
    process.env.NODE_ENV === 'production'
      ? [
        'http://api.smartshop.nhungchangtrainhaycam.site',
        'https://api.smartshop.nhungchangtrainhaycam.site'
      ]
      : '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
};

const app = express();

export type AuthUser = {
  username: string;
  userId: number;
  role: [] | string[] | string;
};

export type Request = ExpressRequest & {
  user?: AuthUser;
};
export type Response = ExpressResponse;

const port = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initModels(sequelizeInstance);

app.use('/admin', adminRouter);

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;