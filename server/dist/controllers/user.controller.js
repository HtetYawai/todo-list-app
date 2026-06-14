import { prisma } from "../lib/prisma.js";
export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        return res.json(users);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};
