import express, {
  NextFunction,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

import { sequelizeInstance } from './db/index';
import { initModels } from './models/init-models';
import adminRouter from './routes/admin';

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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
initModels(sequelizeInstance);

app.use('/admin', adminRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;