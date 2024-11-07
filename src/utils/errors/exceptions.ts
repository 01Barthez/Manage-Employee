import { Response } from "express";
import { HttpCode } from "../../core/constant";
import log from "@src/core/config/logger";
import ResponseMSG from "../responseformat";

const exceptions = {
    badRequest: (res: Response, msg: string) => {
        res.status(HttpCode.BAD_REQUEST)
            .json(ResponseMSG(msg, false))
    },

    notFound : (res: Response, msg: string) => {
        res.status(HttpCode.NOT_FOUND)
            .json(ResponseMSG(msg, false))
    },

    conflict : (res: Response, msg: string) => {
        res.status(HttpCode.CONFLICT)
            .json(ResponseMSG(msg, false))
    },

    forbiden : (res: Response, msg: string) => {
        res.status(HttpCode.FORBIDDEN)
            .json(ResponseMSG(msg, false))
    },

    unauthorized : (res: Response, msg: string) => {
        res.status(HttpCode.UNAUTHORIZED)
            .json(ResponseMSG(msg, false))
    },

    serverError : (res: Response, error: unknown) => {
        const messageError = error instanceof Error ? error.message : JSON.stringify(error);
        log.error('Internal server error', {
            message: messageError,
        });
        res
            .status(HttpCode.INTERNAL_SERVER_ERROR)
            .json(ResponseMSG(messageError, false))
    }
}

export default exceptions;