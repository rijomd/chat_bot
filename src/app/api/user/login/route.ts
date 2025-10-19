import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { DB } from "@/lib/db";
import { response } from "@/lib/utils";
import { expiresToken, JWT_SECRET } from "@/constants/authConstants";
import { Messages, StatusCodes } from "@/constants/requestsConstants";

export const POST = async (req: Request) => {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
        return response({ data: null, message: Messages.VALIDATION_ERROR, code: StatusCodes.BAD_REQUEST });
    }

    const user = await DB.user.findUnique({ where: { email: email } });

    if (!user) {
        return response({ data: null, message: Messages.VALIDATION_ERROR, code: StatusCodes.NOT_FOUND });
    }

    const hashPassword = await bcrypt.compare(password, user.password);

    if (!hashPassword) {
        return response({ data: null, message: Messages.UN_AUTHORIZED, code: StatusCodes.UN_AUTHORIZED });
    }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: expiresToken }
    );

    return response({
        data: {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            token,
        },
        message: Messages.SUCCESS,
        code: StatusCodes.SUCCESS
    });

}