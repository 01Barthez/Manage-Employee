import { envs } from "@src/core/config/env";
import { Request, Response, NextFunction } from "express";

const disableLogsInProduction = (_req: Request, _res: Response, next: NextFunction) => {
    if (envs.NODE_ENV === 'production') {
        console.log = () => { };
        console.warn = () => { };
        console.error = () => { };
        console.info = () => { };
        console.debug = () => { };
    }
    next();
};

export default disableLogsInProduction;
