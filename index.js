import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import authRouter from './router/authRouter.js';

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 9000;

app.use(cors())
app.use(bodyParser.json());


app.use('/api/auth', authRouter)


app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
})