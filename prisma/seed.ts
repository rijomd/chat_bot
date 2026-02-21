import { PrismaClient, MessageType, MessageStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Delete existing data (for clean seed)
    console.log("🗑️  Clearing old data...");
    await prisma.message.deleteMany({});
    await prisma.conversationParticipant.deleteMany({});
    await prisma.conversation.deleteMany({});
    await prisma.user.deleteMany({});

    // Create users with hashed passwords
    console.log("👥 Creating users...");
    const saltRounds = 10;

    const user1 = await prisma.user.create({
        data: {
            email: "alice@mail.com",
            name: "Alice",
            password: await bcrypt.hash("password", saltRounds),
        },
    });

    const user2 = await prisma.user.create({
        data: {
            email: "bob@mail.com",
            name: "Bob",
            password: await bcrypt.hash("password", saltRounds),
        },
    });

    const user3 = await prisma.user.create({
        data: {
            email: "charlie@mail.com",
            name: "Charlie",
            password: await bcrypt.hash("password", saltRounds),
        },
    });

    console.log(`✅ Created users: ${user1.name}, ${user2.name}, ${user3.name}`);

    // --- Conversation 1: user1 <-> user2 ---
    console.log("💬 Creating conversations...");
    const conv1 = await prisma.conversation.create({
        data: {
            participants: {
                create: [
                    { userId: user1.id },
                    { userId: user2.id },
                ],
            },
        },
    });

    await prisma.message.createMany({
        data: [
            {
                conversationId: conv1.id,
                senderId: user1.id,
                content: "Hey Bob! How are you?",
                type: MessageType.TEXT,
                status: MessageStatus.READ,
                createdAt: new Date(Date.now() - 1000 * 60 * 10),
            },
            {
                conversationId: conv1.id,
                senderId: user2.id,
                content: "Hey Alice! I'm good, thanks. You?",
                type: MessageType.TEXT,
                status: MessageStatus.READ,
                createdAt: new Date(Date.now() - 1000 * 60 * 8),
            },
            {
                conversationId: conv1.id,
                senderId: user1.id,
                content: "Doing great! Want to catch up later?",
                type: MessageType.TEXT,
                status: MessageStatus.DELIVERED,
                createdAt: new Date(Date.now() - 1000 * 60 * 5),
            },
        ],
    });

    // --- Conversation 2: user1 <-> user3 ---
    const conv2 = await prisma.conversation.create({
        data: {
            participants: {
                create: [
                    { userId: user1.id },
                    { userId: user3.id },
                ],
            },
        },
    });

    await prisma.message.createMany({
        data: [
            {
                conversationId: conv2.id,
                senderId: user3.id,
                content: "Alice, did you see the latest project update?",
                type: MessageType.TEXT,
                status: MessageStatus.READ,
                createdAt: new Date(Date.now() - 1000 * 60 * 30),
            },
            {
                conversationId: conv2.id,
                senderId: user1.id,
                content: "Not yet! Send me the link.",
                type: MessageType.TEXT,
                status: MessageStatus.SENT,
                createdAt: new Date(Date.now() - 1000 * 60 * 25),
            },
        ],
    });

    console.log("✅ Seeded users, conversations and messages successfully!");
}


main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
