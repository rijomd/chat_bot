import { Messages, StatusCodes } from "@/constants/requestsConstants";
import { authOptions } from "@/lib/auth";
import { DB } from "@/lib/db";
import { response } from "@/lib/utils";
import { getServerSession } from "next-auth";


export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const accessToken = (session as any).accessToken;
        const sessionEmail = session?.user?.email;

        if (!session || !accessToken || !sessionEmail) {
            return response({
                data: null,
                message: Messages.UN_AUTHORIZED,
                code: StatusCodes.UN_AUTHORIZED
            });
        }

        // Get current user
        const currentUser = await DB.user.findUnique({
            where: { email: sessionEmail },
            select: { id: true },
        });

        if (!currentUser) {
            return response({
                data: null,
                message: Messages.UN_AUTHORIZED,
                code: StatusCodes.UN_AUTHORIZED
            });
        }

        // Get users already in conversations with current user
        const usersInConversations = await DB.conversationParticipant.findMany({
            where: {
                conversation: {
                    participants: {
                        some: {
                            userId: currentUser.id,
                        },
                    },
                },
            },
            select: {
                user: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        const conversationUserIds = usersInConversations.map((p) => p.user.id);

        // Get all users except current user and users already in conversations
        const userList = await DB.user.findMany({
            where: {
                NOT: {
                    OR: [
                        { email: sessionEmail },
                        { id: { in: conversationUserIds } },
                    ],
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        });

        return response({
            data: userList,
            message: Messages.SUCCESS,
            code: StatusCodes.SUCCESS
        });
    } catch (error) {
        console.log("❌ sign in error:", error);
        return response({ data: null, message: "something wrong", code: 500 });
    }
}