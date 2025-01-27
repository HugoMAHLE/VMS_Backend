import sql from 'mssql';
import 'dotenv/config';

const config = {
  user: 'sa',
  password: 'dbaaccess',
  server: 'mxjc-m2s11srvt1', // Replace with your server's hostname or IP
  database: 'MS2_Report_Services',
  options: {
    encrypt: true, // Use encryption for data transfer
    trustServerCertificate: true, // Bypass server certificate validation
  },
};

try {
  const pool = await sql.connect(config);
  console.log('Database connected');
  const result = await pool.request().query('SELECT GETDATE() AS CurrentDate');
  console.log(result.recordset);
} catch (error) {
  console.error('Database connection failed:', error);
} finally {
  sql.close(); // Close the pool to avoid resource leaks
}