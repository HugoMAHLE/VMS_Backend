import sql from 'mssql';

const config = {
  user: 'sa',
  password: 'dbaaccess',
  server: 'mxjc-m2s11srvt1',
  database: 'MS2_Report_Services',
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