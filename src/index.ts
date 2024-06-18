import express, {
  NextFunction,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

import cors from 'cors';
import { sequelizeInstance } from './db/index';
import { initModels } from './models/init-models';
import { router as adminRouter } from './routes/admin';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';
import { serviceGoogleApi } from './services/serviceGoogleApi';

const corsOptions = {
  allowedHeaders: ['authorization', 'Content-Type'],
  exposedHeaders: ['authorization'],
  origin: [
    '*',
    'http://localhost:3001',
    'https://diennuoctamnhi.nhungchangtrainhaycam.site',
  ], // or 'http://localhost:<port>' if you're running the app on a specific port
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
};

const app = express();

export type AuthUser = {
  username: string;
  userId: number;
  roles: [] | string[] | string;
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

app.use(serviceGoogleApi);
app.use('/admin', adminRouter);

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;