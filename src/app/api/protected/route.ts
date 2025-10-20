import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { response } from "@/lib/utils";
import { Messages, StatusCodes } from "@/constants/requestsConstants";

// example for protected route :- getServerSession
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return response({
            data: null,
            message: Messages.UN_AUTHORIZED,
            code: StatusCodes.UN_AUTHORIZED
        });
    }

    const accessToken = (session as any).accessToken;

    return response({
        data: {
            user: session.user,
            token: accessToken,
        },
        message: Messages.PROTECTED_ROUTE,
        code: StatusCodes.BAD_REQUEST
    });

}