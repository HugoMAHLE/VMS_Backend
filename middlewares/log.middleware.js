import fs from 'fs';  
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getLogFilePath = () => {
    const today = new Date().toISOString().split('T')[0]; // Obtiene YYYY-MM-DD
    return { path: path.join(__dirname, `../logs/${today}.log`), today };
};

const saveLog = (msg, module = 'GENERAL', level = 'INFO') => {
    const { path: logFilePath, today } = getLogFilePath(); // Ahora today está disponible
    const time = new Date().toLocaleTimeString(); // Obtiene la hora HH:MM:SS
    const logEntry = `[${time}] [${level}] [${module}] ${msg}\n`;

    try {
        if (!fs.existsSync(path.dirname(logFilePath))) {
            fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
        }

        if (!fs.existsSync(logFilePath)) {
            fs.writeFileSync(logFilePath, `=== LOG ${today} ===\n`, 'utf8');
        }

        fs.appendFileSync(logFilePath, logEntry);
    } catch (error) {
        console.error('Error al escribir en el log:', error);
    }
};

export { saveLog };