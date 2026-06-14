import { prisma } from "../lib/prisma.js";
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name?.trim()) {
            return res.status(400).json({
                message: "Category name required",
            });
        }
        const category = await prisma.category.create({
            data: {
                name,
                userId: req.userId,
            },
        });
        return res.status(201).json(category);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};
export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            where: {
                userId: req.userId,
            },
            orderBy: {
                name: "asc",
            },
        });
        return res.json(categories);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};
export const updateCategory = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name } = req.body;
        const category = await prisma.category.findFirst({
            where: {
                id,
                userId: req.userId,
            },
        });
        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }
        const updated = await prisma.category.update({
            where: {
                id,
            },
            data: {
                name,
            },
        });
        return res.json(updated);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};
export const deleteCategory = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const category = await prisma.category.findFirst({
            where: {
                id,
                userId: req.userId,
            },
        });
        if (!category) {
            return res.status(404).json({
                message: "Category not found",
            });
        }
        await prisma.category.delete({
            where: {
                id,
            },
        });
        return res.json({
            message: "Deleted",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};
