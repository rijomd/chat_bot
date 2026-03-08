import { PrismaClient, MessageType, MessageStatus, ChatbotMessageSender } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    console.log("user creation started...");
    const saltRounds = 10;
    const userCount = 5;
    const usersData = await Promise.all(
        Array.from({ length: userCount }).map(async (_, i) => {
            const hashedPassword = await bcrypt.hash(`password${i}`, saltRounds);
            return {
                email: `test${i}@gmail.com`,
                name: `Test User ${i}`,
                password: hashedPassword,
            };
        })
    );
    const createdUsers = await prisma.user.createMany({
        data: usersData,
        skipDuplicates: true,
    });
    console.log(`${createdUsers.count} users created successfully!`);

    console.log("Creating chatBots...");
    const chatBotsData = [
        {
            label: "Sports",
            description: "Sports related news and updates",
            icon: "⚽",
            backgroundColor: "bg-emerald-50",
            textColor: "text-emerald-700",
            color: "from-emerald-400 to-teal-500",
        },
        {
            label: "Movies",
            description: "Find anything about movies",
            icon: "🎬",
            backgroundColor: "bg-blue-50",
            textColor: "text-blue-700",
            color: "from-blue-400 to-indigo-500",
        },
        {
            label: "Fashion",
            description: "Get the latest fashion trends",
            icon: "👗",
            backgroundColor: "bg-violet-50",
            textColor: "text-violet-700",
            color: "from-violet-400 to-purple-500",
        },
        {
            label: "Cooking",
            description: "Get smart cooking tips and recipes",
            icon: "🍳",
            backgroundColor: "bg-orange-50",
            textColor: "text-orange-700",
            color: "from-orange-400 to-rose-500",
        },
    ];

    const createdChatBots = await prisma.chatbot.createMany({
        data: chatBotsData,
        skipDuplicates: true,
    });
    console.log(`${createdChatBots.count} chatBots created successfully!`);

    console.log("✅ Database seeding completed!");
}


main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
