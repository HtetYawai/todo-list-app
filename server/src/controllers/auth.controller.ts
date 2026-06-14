import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { prisma } from "../lib/prisma.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user =
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

const defaultCategories = [
  "Personal",
  "Work",
  "Study",
  "Health",
  "Finance",
  "Shopping",
];

await prisma.category.createMany({
  data: defaultCategories.map(
    (name) => ({
      name,
      userId: user.id,
    })
  ),
});

const token =
  generateToken(user.id);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const login = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token =
      generateToken(user.id);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getCurrentUser =
  async (
    req: Request,
    res: Response,
  ) => {
    try {
      const user =
        await prisma.user.findUnique({
          where: {
            id: req.userId,
          },

          select: {
            id: true,
            name: true,
            email: true,
          },
        });

      return res.json(user);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Server error",
      });
    }
  };