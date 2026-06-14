import {
  Request,
  Response,
  NextFunction,
} from "express";

import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader =
    req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      message: "Unauthorized",
    });

    return;
  }

  const token =
    authHeader.split(" ")[1];

  try {
    const payload =
      jwt.verify(
        token,
        process.env.JWT_SECRET!,
      ) as JwtPayload;

    req.userId =
      payload.userId;

    next();
  } catch {
    res.status(401).json({
      message: "Invalid token",
    });
  }
};