
import { Request, Response, NextFunction } from "express";
import log from "@src/core/config/logger";
import { validationResult } from "express-validator";
import { HttpCode } from "@src/core/constant";
import exceptions from "@src/utils/errors/exceptions";

export const validate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            log.error(errors.array());
            res
                .status(HttpCode.UNPROCESSABLE_ENTITY)
                .json({ error: errors.array() })
        }
        next();
    } catch (error) {
        log.error(`Validation failed: ${error}`);
        exceptions.serverError(res, error);
    }
}
