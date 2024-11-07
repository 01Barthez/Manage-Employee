import { HttpCode } from "@src/core/constant";
import { Request, Response, NextFunction } from "express";

const csrfErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const messageError = `${err instanceof Error ? err.message : JSON.stringify(err)}`
    if (err.code !== 'EBADCSRFTOKEN') return next(messageError);

    res
        .status(HttpCode.FORBIDDEN)
        .json({ error: 'jeton CSRF invalide.' });
  };

  export default csrfErrorHandler