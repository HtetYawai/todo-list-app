import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const createTask = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      title,
      description,
      status,
      dueDate,
      reminderAt,
      categoryId,
      assignedToId,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        dueDate: dueDate
        ? new Date(dueDate)
        : null,

        reminderAt: reminderAt
        ? new Date(reminderAt)
        : null,

        ownerId: req.userId!,

        categoryId,

        assignedToId,
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getTasks = async (
  req: Request,
  res: Response
) => {
  try {
    const search = req.query.search as string;
    const status = req.query.status as string;
    const categoryId = req.query.categoryId as string;
    const sort = req.query.sort as string;

    const tasks = await prisma.task.findMany({
      where: {
        ownerId: req.userId,

        ...(search && {
          OR: [
            {
              title: {
                contains: search,
              },
            },
            {
              description: {
                contains: search,
              },
            },
          ],
        }),

        ...(status && {
          status: status as any,
        }),

        ...(categoryId && {
          categoryId: Number(categoryId),
        }),
      },

      include: {
        category: true,

        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },

      orderBy:
      sort === "dueDate"? {dueDate: "asc",}
      : {
        createdAt: "desc",
      },
    });

    return res.json(tasks);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getAssignedTasks = async (
  req: Request,
  res: Response
) => {
  try {
    const tasks =
      await prisma.task.findMany({
        where: {
          assignedToId: req.userId,

          ownerId: {
            not: req.userId,
          },
        },

        include: {
          category: true,

          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },

        orderBy: {
          dueDate: "asc",
        },
      });

    return res.json(tasks);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Server error",
    });
  }
};

export const updateTask = async (
  req: Request,
  res: Response
) => {

  try {
    const id = Number(req.params.id);

    const {
      title,
      description,
      status,
      dueDate,
      reminderAt,
      categoryId,
      assignedToId,
    } = req.body;

    const existingTask =
      await prisma.task.findFirst({
        where: {
          id,
          ownerId: req.userId,
        },
      });

    if (!existingTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const updatedTask =
      await prisma.task.update({
        where: {
          id,
        },

        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && {
            description,
          }),
          ...(status !== undefined && {
            status,
          }),
          ...(dueDate !== undefined && {
            dueDate: dueDate
              ? new Date(dueDate)
              : null,
          }),
          ...(reminderAt !== undefined && {
            reminderAt: reminderAt
                ? new Date(reminderAt)
                : null,
            }),
          ...(categoryId !== undefined && {
            categoryId,
          }),
          ...(assignedToId !== undefined && {
            assignedToId,
          }),
        },

        include: {
          category: true,

          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

    return res.json(updatedTask);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const task = await prisma.task.findFirst({
      where: {
        id,
        ownerId: req.userId,
      },
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await prisma.task.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getDashboardStats = async (
  req: Request,
  res: Response
) => {
  try {
    const totalTasks =
      await prisma.task.count({
        where: {
          ownerId: req.userId,
        },
      });

    const completedTasks =
      await prisma.task.count({
        where: {
          ownerId: req.userId,
          status: "COMPLETED",
        },
      });

    const pendingTasks =
      await prisma.task.count({
        where: {
          ownerId: req.userId,
          status: "PENDING",
        },
      });

    const inProgressTasks =
      await prisma.task.count({
        where: {
          ownerId: req.userId,
          status: "IN_PROGRESS",
        },
      });

    const completionRate =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks /
              totalTasks) *
              100
          );

    return res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      completionRate,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getRecentTasks = async (
  req: Request,
  res: Response
) => {
  try {
    const tasks =
      await prisma.task.findMany({
        where: {
          ownerId: req.userId,
        },

        take: 5,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          category: true,
        },
      });

    res.json(tasks);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getUpcomingReminders =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const reminders =
        await prisma.task.findMany({
          where: {
            ownerId: req.userId,

            reminderAt: {
              gt: new Date(),
            },

            reminded: false,
          },

          orderBy: {
            reminderAt: "asc",
          },

          take: 5,

          include: {
            category: true,
          },
        });

      return res.json(reminders);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Server error",
      });
    }
  };

  export const markReminderTriggered = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await prisma.task.update({
      where: {
        id,
      },

      data: {
        reminded: true,
      },
    });

    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};


export const getPendingReminders =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      const reminders =
        await prisma.task.findMany({
          where: {
            ownerId: req.userId,

            reminderAt: {
              not: null,
            },

            reminded: false,
          },

          orderBy: {
            reminderAt: "asc",
          },
        });

      return res.json(
        reminders
      );
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Server error",
      });
    }
  };