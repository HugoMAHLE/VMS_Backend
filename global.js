import { saveLog } from './middlewares/log.middleware.js';

global.logger = saveLog;