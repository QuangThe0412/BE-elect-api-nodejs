import express, {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

import cors from 'cors';
import { sequelizeInstance } from './db/index';
import { initModels } from './models/init-models';
import { router as adminRouter } from './routes/admin';
import { router as clientRouter } from './routes/client';
import errorHandlerMiddleware from './middlewares/error-handler.middleware';
import { serviceGoogleApi } from './services/serviceGoogleApi';

console.log('NODE_ENV :', process.env.npm_lifecycle_event);

const corsOptions = {
  allowedHeaders: ['authorization', 'Content-Type'],
  exposedHeaders: ['authorization'],
  origin:
    process.env.npm_lifecycle_event === 'dev'
      ? '*'
      : [
        'http://localhost:3001',
        'https://localhost:3001',
        'http://192.168.1.104:3001',
        'https://192.168.1.104:3001',
        'http://localhost:4005',
        'https://localhost:4005',
        'http://192.168.1.104:4005',
        'https://192.168.1.104:4005'
      ],
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
app.use('/client', clientRouter);

// Route để kiểm tra server
app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`ENV: ${process.env.npm_lifecycle_event}`);
  console.log(`URL Health Check: http://localhost:${port}/health`);
});

export default app;