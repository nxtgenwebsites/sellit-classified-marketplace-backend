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

app.get("/data-deletion", (req, res) => {
    return res.send(`
    <h2>Data Deletion Instructions</h2>
    <p>If you want your data to be deleted from our platform, please email us at <strong>sellit.classified.team@gmail.com</strong> with your Facebook ID or login email.</p>
  `);
});

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
})