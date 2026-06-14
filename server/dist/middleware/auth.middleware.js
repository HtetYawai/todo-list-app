import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({
            message: "Unauthorized",
        });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId =
            payload.userId;
        next();
    }
    catch {
        res.status(401).json({
            message: "Invalid token",
        });
    }
};
