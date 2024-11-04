import { Request, Response } from "express";
import fetchAccessToken from "./fetchAccessToken";
import blackListToken from "./blackListToken";
import log from "@src/core/config/logger";


const blackListAccessAndRefresToken = async (req: Request, res: Response) => {
    const accessToken = fetchAccessToken(req, res);
    await blackListToken.AddToblackList(accessToken);
    log.info("Access token is blacklited !");
    
    const refreshToken = req.cookies['refresh_key'] || '';
    await blackListToken.AddToblackList(refreshToken);
    log.info("refresh token is blacklited !");
}

export default blackListAccessAndRefresToken;