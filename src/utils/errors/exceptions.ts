import { Response } from "express";
import { HttpCode } from "../../core/constant";
import log from "@src/core/config/logger";

const exceptions = {
    badRequest: (res: Response, msg: string) => {
        res.status(HttpCode.BAD_REQUEST)
            .json({msg: msg})
    },

    notFound : (res: Response, msg: string) => {
        res.status(HttpCode.NOT_FOUND)
            .json({msg: msg})
    },

    conflict : (res: Response, msg: string) => {
        res.status(HttpCode.CONFLICT)
            .json({msg: msg})
    },

    forbiden : (res: Response, msg: string) => {
        res.status(HttpCode.FORBIDDEN)
            .json({msg: msg})
    },

    unauthorized : (res: Response, msg: string) => {
        res.status(HttpCode.UNAUTHORIZED)
            .json({msg: msg})
    },

    serverError : (res: Response, error: unknown) => {
        const messageError = error instanceof Error ? error.message : JSON.stringify(error);
        log.error('Internal server error', {
            message: messageError,
        });
        res
            .status(HttpCode.INTERNAL_SERVER_ERROR)
            .json({msg: messageError})
    }
}

export default exceptions;