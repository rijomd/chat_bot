import { NextResponse } from "next/server";

type ResponseType = {
    data: any;
    message?: string;
    code?: number;
}

export const response = ({ data, message, code }: ResponseType) => NextResponse.json({
    data: data, message: message || "success", code: code || 200
}, { status: code || 200 });
