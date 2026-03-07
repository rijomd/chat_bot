import { response } from "@/lib/utils"
import { Messages, StatusCodes } from "@/constants/requestsConstants"

export const GET = async () => {
    return response({
        data: null,
        message: Messages.SUCCESS,
        code: StatusCodes.SUCCESS
    })
}



