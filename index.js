import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import userModel from './models/userModel.js';
import authRouter from './router/authRouter.js';

connectDB();
dotenv.config();

const app = express();
const port = process.env.PORT || 9000;

app.use(cors())
app.use(bodyParser.json());


app.use('/api/auth', authRouter)

app.get('/' , async (req , res) =>{
        const usersData = await userModel.find({})
        res.json(usersData)
})


app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
})