import sql from 'mssql';

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

const connectToDb = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    if (pool.connected) console.log('Database connected successfully!');
    return pool;
  } catch (err) {
    console.error('Database connection failed: ', err);
  }
};

export default connectToDb;