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
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger-output.json';

const isDev = process.env.npm_lifecycle_event === 'dev';
console.log('NODE_ENV :', process.env.npm_lifecycle_event);

const corsOptions = {
  allowedHeaders: ['authorization', 'Content-Type'],
  exposedHeaders: ['authorization'],
  origin:
    isDev
      ? '*'
      : [
        'http://cms-diennuoctamnhi.nhungchangtrainhaycam.site',
        'https://cms-diennuoctamnhi.nhungchangtrainhaycam.site',
        'http://diennuoctamnhi.nhungchangtrainhaycam.site',
        'https://diennuoctamnhi.nhungchangtrainhaycam.site'
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
app.use(adminRouter);
app.use(clientRouter);

if (isDev) {
  let pathSwagger = '/swagger';
  app.use(pathSwagger, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log(`Swagger is running on http://localhost:${port}${pathSwagger}`);
}

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;