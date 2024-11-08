
import { Request, Response, NextFunction } from "express";
import log from "@src/core/config/logger";
import { validationResult } from "express-validator";
import { HttpCode } from "@src/core/constant";

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        log.error(errors.array());
        res
            .status(HttpCode.UNPROCESSABLE_ENTITY)
            .json({ errors: errors.array() })
    }
    next();
}
