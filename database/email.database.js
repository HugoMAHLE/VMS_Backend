import pg from 'pg'
import 'dotenv/config'

const {Pool} = pg
const connectionString = process.env.EMAILDB_URL


export const edb = new Pool({
  allowExitOnIdle: true,
  connectionString
})

try {
  await edb.query('SELECT NOW()')
  console.log('Database connected')
} catch (error) {
  console.log(error)
}


