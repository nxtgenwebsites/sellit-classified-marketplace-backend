import jwt from 'jsonwebtoken';

export const verifyUserToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, '6B#zj$49@qzFv^L2pH7!xK$mWp3!rQd9vNcEjwA2');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
