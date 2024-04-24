import express from 'express';
import sql from 'mssql';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(`.env`) });

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '1433'),
  database: process.env.DB_NAME,
  options: {
    encrypt: false, // Use this if you're on Windows Azure
  }
};
console.log({dbConfig})
sql.connect(dbConfig).then(pool => {
  if (pool.connected) console.log('Database connected successfully!');

  // Use your routes here
  // app.use('/api', routes);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Database connection failed: ', err);
});

export default app;