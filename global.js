import { saveLog } from './middlewares/log.middleware.js';
import {db} from '../database/connection.database.js'
import {edb, sql} from '../database/email.database.js'

global.logger = saveLog;
global.db = db;
global.edb = edb;
global.sql =sql;