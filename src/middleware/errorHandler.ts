import log from "@src/core/config/logger";
import { HttpCode } from "@src/core/constant";
import { NextFunction, Request, Response } from "express";

const errorHandler = (
    err: Error,
    _req:Request,
    res: Response,
    // eslint-disable-next-line 
    _next: NextFunction
) => {
    const errorMessage = `${ err.message }`;
    const stackMessage = `${ err.stack }`;

    log.error(`Internal Server Error: \nError: ${errorMessage}; \nStack: ${stackMessage}`)
    
    res
    .status(HttpCode.INTERNAL_SERVER_ERROR)
    .json({
        success: false,
        message: errorMessage,
        stack: stackMessage
    })
}

export default errorHandler