import { DB } from "@/lib/db";
import { response } from "@/lib/utils";

import bcrypt from "bcrypt";
import { z } from "zod";

const saltRounds = 10;

const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string()
});

export const POST = async (req: Request) => {
    try {
        const body = await req.json();
        const { email, name, password } = body;

        const result = signInSchema.safeParse(body);

        if (!result.success) {
            return response({ data: result.error.issues, message: "validation error", code: 400 });
        }

        const isExistEmail = await DB.user.findUnique({ where: { email: email } });

        if (isExistEmail) {
            return response({ data: null, message: "user already exist", code: 409 });
        }

        const hashPassword = await bcrypt.hash(password, saltRounds);

        const user = await DB.user.create({
            data: {
                email: email,
                name: name,
                password: hashPassword
            }
        });

        return response({ data: user.name, message: "user created successfully" });
    } catch (error) {
        return response({ data: null, message: "something wrong" });
    }

}