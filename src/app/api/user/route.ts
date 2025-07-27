import { DB } from "@/lib/db";
import { response } from "@/lib/utils";
import { NextResponse } from "next/server"
import bcrypt from "bcrypt";

const saltRounds = 10;

export const GET = async () => {
    return NextResponse.json("success")
}

export const POST = async (req: Request) => {
    const body = await req.json();
    const { email, name, password } = body;

    const isExistEmail = await DB.user.findUnique({ where: { email: email } });

    if (isExistEmail) {
        return response({ data: null, message: "user already exist", code: 400 });
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
}