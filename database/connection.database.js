const pg = require('pg')
require('dotenv').config()

const {Pool} = pg
const connectionString = process.env.DATABASE_URL


const db = new Pool({
  allowExitOnIdle: true,
  connectionString
})

// Handle unhandled rejections at process level to prevent crashes
// This ensures the promise rejection doesn't propagate up and crash the server
process.on('unhandledRejection', (reason, promise) => {
  console.warn('Database connection warning:', reason?.message || reason)
})

// Properly handle the async connection test with try/catch
// The server should start regardless of database availability (graceful degradation)
const testConnection = async () => {
  try {
    await db.query('SELECT NOW()')
    console.log('PostgreSQL Database connected')
  } catch (error) {
    console.warn('PostgreSQL database unavailable:', error.message)
    console.warn('Server will continue running without PostgreSQL database')
  }
}

// Execute the connection test
testConnection()

module.exports = { db }


