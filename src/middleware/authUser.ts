import { NextFunction, Response } from "express";
import userToken from "../services/jwt/jwt-functions";
import exceptions from "../utils/errors/exceptions";
import { envs } from "../core/config/env";
import { customRequest } from "../core/interfaces/interfaces";
import log from "@src/core/config/logger";
import fetchAccessToken from "@src/utils/helpers/fetchAccessToken";
import blackListToken from "@src/utils/helpers/blackListToken";

const authUser = async (req: customRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const accessToken = fetchAccessToken(req, res);
        // log.debug(`Token extracted: ${accessToken}`);

        const isBlackListed_accessToken = await blackListToken.isBlackListToken(accessToken);

        // S'il a l'access token et que c'est pas blacklisté...
        if (accessToken && !isBlackListed_accessToken) {
            try {
                log.debug("User has and access token and, isn't blacklisted ...");

                // Vérifier le token d'access reçu est valide ou bien formé
                const userData = userToken.verifyAccessToken(accessToken);
                if (userData) {
                    log.info("access token exist et vérifié avec succès...")

                    req.employee = userData;
                    return next();
                }

                // Si le token est expiré, vérifier le refresh token et regenerer un nouveau access token...
                log.debug("L'access token de l'utilisateur a expiré ou est malformé...");
            } catch (error) {
                const errorMessage = (error instanceof Error && error.name === "TokenExpiredError") ?
                    "Access token expired. Trying refresh token..."
                    :
                    "Error occured when trying to decode access token..."
                    ;

                log.warn(errorMessage)
            }
        }
        log.debug("On passe a la verificaion du refresh Token !");

        // Vérification du refresh token si le token d'accès est expiré ou absent
        const refreshToken = req.cookies['refresh_key'];
        log.debug(`refresh token recuperer des cookie`);

        // Verifier que le refresh token est bien recuperer, sinon renvoyé l'erreur, on ne peux continuer sans ça
        if (!refreshToken) {
            log.warn("Invalid or expired refresh token. Please login again.");
            return exceptions.unauthorized(res, "Invalid or expired tokens. Please login again.");
        }

        // Se rassurer que le token de rafraichissement n'est pas blacklisté
        const isBlackListed_refreshToken = await blackListToken.isBlackListToken(refreshToken);
        if (isBlackListed_refreshToken) {
            log.warn("This access token is blacklisted.");
            return exceptions.unauthorized(res, "This access token is blacklisted !");
        }
        log.debug("Le token de rafraichissement n'est pas blacklisté");

        const userData = userToken.verifyRefreshToken(refreshToken);
        if (!userData) {
            log.warn("Invalid or expired refresh token.");
            return exceptions.unauthorized(res, "Invalid or expired refresh token.");
        }
        log.debug("token de rafraichissement verifier avec success !");

        // Générer un nouveau access token
        userData.password = "";

        // Apparemment on a un bug du a la presence de exp dans le payload=userData retirons ça
        const { exp, iat, ...cleanUserData } = userData;
        log.debug(`date d'expiration du token: ${exp}, date d'emission: ${iat}`);

        const newAccessToken = userToken.accessToken(cleanUserData);
        res.setHeader('authorization', `Bearer ${newAccessToken}`);
        log.debug('Nouveau access token regenerer et stoké dans le header authorisation...');

        // Mettre à jour le refresh token Je me dis que c'est une bonne chose pour renouveller la date d'expiration du refresh token
        const newRefreshToken = userToken.refreshToken(cleanUserData);

        // Blacklister l'ancien refresh token
        await blackListToken.AddToblackList(refreshToken)

        res.clearCookie('refresh_key', {
            secure: envs.JWT_COOKIE_SECURITY,
            httpOnly: envs.JWT_COOKIE_HTTP_STATUS,
            sameSite: 'strict',
        });
        res.cookie('refresh_key', newRefreshToken, {
            httpOnly: envs.JWT_COOKIE_HTTP_STATUS,
            secure: envs.JWT_COOKIE_SECURITY,
            maxAge: envs.JWT_COOKIE_DURATION,
            sameSite: 'strict',
        });
        log.debug("generate new refresh token");

        //* Fin des opértaions on retourne terminer la requete
        req.employee = cleanUserData;
        return next();
    } catch (error) {
        log.error(`Echec d'authentification de l'utilisateur...: ${error}`);
        exceptions.serverError(res, error);
    }
};

export default authUser;