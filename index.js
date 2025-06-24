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


app.post('/signup', async (req, res) => {
    try {
        const { username, identifier, password } = req.body;

        // Check if user already exists
        const userExists = await userModel.findOne({ identifier });

        if (userExists) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Check if username already exists
        const usernameExists = await userModel.findOne({ username });

        if (usernameExists) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({
            username,
            identifier,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id },
            '6B#zj$49@qzFv^L2pH7!xK$mWp3!rQd9vNcEjwA2',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                identifier: newUser.identifier,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

app.use('/api/auth', authRouter)

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
})