import { NextResponse } from "next/server";
import { ResponseType } from "@/types/login";
import { Messages, StatusCodes } from "@/constants/requestsConstants";

export const response = ({ data, message, code }: ResponseType) => NextResponse.json({
    data: data, message: message || Messages.SUCCESS, code: code || StatusCodes.SUCCESS
}, { status: code || StatusCodes.SUCCESS });
