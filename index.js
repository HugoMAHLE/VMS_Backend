import 'dotenv/config';
import express, { urlencoded } from 'express';
import userRouter from './routes/user.route.js'
import visitorRouter from './routes/visitor.route.js'
import cors from "cors"

const app = express();

const corsOptions = {
  //origin: process.env.CLIENT_URL,
  // origin: (origin, callback) => {
  //   if (!origin || origin.startsWith('http://10.93.')) {
  //     callback(null, true); // Allow requests from your LAN
  //   } else {
  //     callback(new Error('Not allowed by CORS')); // Block other origins
  //   }
  // },
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

app.get('/', (req, res) => {
  res.send('Server is running!');
});

const PORT = process.env.PORT || 3000;

//app.listen(PORT, () => console.log('Servidor corriendo en puerto: ' + PORT))

app.listen(PORT, '0.0.0.0', () => {
  console.log('Servidor corriendo en puerto: ' + PORT);
});
