import 'dotenv/config';
import express, { urlencoded } from 'express';
import userRouter from './routes/user.route.js'
import visitorRouter from './routes/visitor.route.js'
import emailRouter from './routes/email.route.js';
import visitRouter from './routes/visit.route.js'
import cors from "cors"

const app = express();

const corsOptions = {
  origin: '*',
  methods: 'GET, POST, PUT, DELETE, OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/users', userRouter)
app.use('/api/v1/visitor', visitorRouter)
app.use('/api/v1/email', emailRouter);
app.use('/api/v1/visit', visitRouter);

app.get('/', (req, res) => {
  res.send('Server is running!');
});

const PORT = process.env.PORT || 3000;

//app.listen(PORT, () => console.log('Servidor corriendo en puerto: ' + PORT))

app.listen(PORT, '0.0.0.0', () => {
  console.log('Servidor corriendo en puerto: ' + PORT);
});


