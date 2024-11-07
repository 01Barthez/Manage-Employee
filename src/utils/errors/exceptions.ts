import { Response } from "express";
import { HttpCode } from "../../core/constant";
import log from "@src/core/config/logger";

const exceptions = {
    badRequest: (res: Response, msg: string) => {
        res.status(HttpCode.BAD_REQUEST)
            .json({success: false, msg: msg})
    },

    notFound : (res: Response, msg: string) => {
        res.status(HttpCode.NOT_FOUND)
            .json({success: false, msg: msg})
    },

    conflict : (res: Response, msg: string) => {
        res.status(HttpCode.CONFLICT)
            .json({success: false, msg: msg})
    },

    forbiden : (res: Response, msg: string) => {
        res.status(HttpCode.FORBIDDEN)
            .json({success: false, msg: msg})
    },

    unauthorized : (res: Response, msg: string) => {
        res.status(HttpCode.UNAUTHORIZED)
            .json({success: false, msg: msg})
    },

    serverError : (res: Response, error: unknown) => {
        const messageError = error instanceof Error ? error.message : JSON.stringify(error);
        log.error('Internal server error', {
            message: messageError,
        });
        res
            .status(HttpCode.INTERNAL_SERVER_ERROR)
            .json({success: false, msg: messageError})
    }
}

export default exceptions;