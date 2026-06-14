import "dotenv/config";
import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import { prisma } from "../src/lib/prisma";
async function main() {
    console.log("Seeding started...");
    await prisma.task.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    const password = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
        data: {
            name: "Yawai",
            email: "yawai@gmail.com",
            password,
        },
    });
    const categoryNames = [
        "Personal",
        "Work",
        "Study",
        "Health",
        "Finance",
        "Shopping",
    ];
    const categories = [];
    for (const name of categoryNames) {
        const category = await prisma.category.create({
            data: {
                name,
                userId: user.id,
            },
        });
        categories.push(category);
    }
    const taskData = [
        {
            title: "Buy groceries",
            category: "Shopping",
        },
        {
            title: "Pay electricity bill",
            category: "Finance",
        },
        {
            title: "Morning workout",
            category: "Health",
        },
        {
            title: "Prepare weekly report",
            category: "Work",
        },
        {
            title: "Submit assignment",
            category: "Study",
        },
        {
            title: "Call family",
            category: "Personal",
        },
        {
            title: "Book dentist appointment",
            category: "Health",
        },
        {
            title: "Review monthly budget",
            category: "Finance",
        },
        {
            title: "Read a book",
            category: "Personal",
        },
        {
            title: "Team meeting",
            category: "Work",
        },
        {
            title: "Complete online course",
            category: "Study",
        },
        {
            title: "Buy birthday gift",
            category: "Shopping",
        },
        {
            title: "Track expenses",
            category: "Finance",
        },
        {
            title: "Meditation session",
            category: "Health",
        },
        {
            title: "Plan weekend trip",
            category: "Personal",
        },
        {
            title: "Organize study notes",
            category: "Study",
        },
        {
            title: "Finish project proposal",
            category: "Work",
        },
        {
            title: "Schedule doctor visit",
            category: "Health",
        },
        {
            title: "Update resume",
            category: "Work",
        },
        {
            title: "Buy household supplies",
            category: "Shopping",
        },
    ];
    const statuses = [
        "PENDING",
        "IN_PROGRESS",
        "COMPLETED",
    ];
    for (let i = 0; i < 20; i++) {
        const task = taskData[faker.number.int({
            min: 0,
            max: taskData.length - 1,
        })];
        const category = categories.find((c) => c.name === task.category);
        await prisma.task.create({
            data: {
                title: task.title,
                description: faker.lorem.sentence(),
                status: statuses[faker.number.int({
                    min: 0,
                    max: 2,
                })],
                dueDate: faker.date.future(),
                ownerId: user.id,
                assignedToId: user.id,
                categoryId: category.id,
            },
        });
    }
    console.log("Seeding complete.");
}
main()
    .catch((error) => {
    console.error(error);
})
    .finally(async () => {
    await prisma.$disconnect();
});
