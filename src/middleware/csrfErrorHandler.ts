import { HttpCode } from "@src/core/constant";
import ResponseMSG from "@src/utils/responseformat";
import { Request, Response, NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const csrfErrorHandler = (err: any, _req: Request, res: Response, next: NextFunction) => {
    const messageError = `${err instanceof Error ? err.message : JSON.stringify(err)}`
    if (err.code !== 'EBADCSRFTOKEN') return next(messageError);

    res
        .status(HttpCode.FORBIDDEN)
        .json(ResponseMSG('jeton CSRF invalide.'));
  };

  export default csrfErrorHandler