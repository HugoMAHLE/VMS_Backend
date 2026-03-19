require('dotenv').config();
const express = require('express');
const userRouter = require('./routes/user.route.js');
const visitorRouter = require('./routes/visitor.route.js');
const emailRouter = require('./routes/email.route.js');
const visitRouter = require('./routes/visit.route.js');
const cors = require('cors');
require('./global.js');

const app = express();

const corsOptions = {
  origin: '*',
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/visitor', visitorRouter);
app.use('/api/v1/email', emailRouter);
app.use('/api/v1/visit', visitRouter);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Error Handlers for crashes
process.on('uncaughtException', (err) => {
  logger('Uncaught Exeption: ' + err.message, "START", "ERROR");
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger('Unhandled Rejection: ' + err.message, "START", "ERROR");
  process.exit(1);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  logger('Servidor corriendo en puerto: ' + PORT, "START", "STATUS");
});