import { prisma } from "../lib/prisma";
export const addCollaborator = async (req, res) => {
    try {
        const { email } = req.body;
        const collaborator = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!collaborator) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        if (collaborator.id === req.userId) {
            return res.status(400).json({
                message: "You cannot add yourself",
            });
        }
        const existing = await prisma.collaboration.findUnique({
            where: {
                ownerId_collaboratorId: {
                    ownerId: req.userId,
                    collaboratorId: collaborator.id,
                },
            },
        });
        if (existing) {
            return res.status(400).json({
                message: "Collaborator already added",
            });
        }
        await prisma.collaboration.createMany({
            data: [
                {
                    ownerId: req.userId,
                    collaboratorId: collaborator.id,
                },
                {
                    ownerId: collaborator.id,
                    collaboratorId: req.userId,
                },
            ],
        });
        const record = await prisma.collaboration.findFirst({
            where: {
                ownerId: req.userId,
                collaboratorId: collaborator.id,
            },
            include: {
                collaborator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return res.status(201).json(record);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};
export const getCollaborators = async (req, res) => {
    try {
        const collaborators = await prisma.collaboration.findMany({
            where: {
                ownerId: req.userId,
            },
            include: {
                collaborator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return res.json(collaborators);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};
export const removeCollaborator = async (req, res) => {
    try {
        const id = Number(req.params.id);
        await prisma.collaboration.delete({
            where: {
                id,
            },
        });
        return res.json({
            message: "Collaborator removed",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};
