import sql from 'mssql';

const config = {
  user: 'dlocapp',
  password: 'dl0capp',
  server: 'MXJCAP21SRV01',
  database: 'VMS_Mahle',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

export const edb = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log('Connected to MSSQL');
    return pool;
  })
  .catch((err) => {
    console.error('Database Connection Failed! Bad Config: ', err);
    throw err;
  });

export { sql };