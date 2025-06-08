import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const token = req.cookies.blogApp;
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided, please login"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        req.user = decoded;  // Attach user data to the request
        next();
    });
};

export default authMiddleware;