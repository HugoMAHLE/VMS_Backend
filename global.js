const { saveLog } = require('./middlewares/log.middleware.js');
const {db} = require('./database/connection.database.js')
const {edb, sql} = require('./database/email.database.js')

global.logger = saveLog;
global.db = db;
global.edb = edb;
global.sql =sql;