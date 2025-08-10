import { DB } from "@/lib/db";
import { response } from "@/lib/utils";
import bcrypt from "bcrypt";

export const POST = async (req: Request) => {
    const body = await req.json();
    const { email, password } = body;

    const isExistEmail = await DB.user.findUnique({ where: { email: email } });

    if (!isExistEmail) {
        return response({ data: null, message: "user is not exist! please sign up", code: 404 });
    }

    const hashPassword = await bcrypt.compare(password, isExistEmail.password);

    if (!hashPassword) {
        return response({ data: null, message: "Authorization error", code: 401 });
    }

    return response({ data: "12345678" });
}