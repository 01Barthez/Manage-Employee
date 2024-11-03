import { NextFunction, Response } from "express";
import userToken from "../services/jwt/jwt-functions";
import exceptions from "../utils/errors/exceptions";
import { envs } from "../core/config/env";
import { customRequest } from "../core/interfaces/interfaces";
import { HttpCode } from "../core/constant";
import log from "@src/core/config/logger";

const authUser = async (req: customRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers['authorization'];
        log.debug(`authHeader extracted: ${authHeader}`);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            log.error("Authorization header is malformed !");
            return exceptions.unauthorized(res, "Malformed token.");
        }
        const accessToken = authHeader.replace('Bearer Bearer', 'Bearer').split(" ")[1] || ""; // Because i don't know qhy but we often have two Bearer world...
        log.debug(`Token extracted: ${accessToken}`);

        if (accessToken) {
            try {
                // Vérifier le token d'access reçu
                const userData = userToken.verifyAccessToken(accessToken);
                if (userData) {
                    log.info("access token exist et vérifié avec succès...")
                    req.employee = userData;
                    return next();
                }
            } catch (error) {
                // Si le token est expiré, vérifier le refresh token
                if (error instanceof Error && error.name === "TokenExpiredError") {
                    log.error("Access token expired. Trying refresh token...");
                } else {
                    log.error("Error occured when trying to decode access token...");
                }

                throw new Error("failed to decode access token !");
            }
        }

        // Vérification du refresh token si le token d'accès est expiré ou absent
        let refreshToken = req.cookies['refresh_key'];

        if (!refreshToken) {
            log.error("Invalid or expired tokens. Please login again.");
            return exceptions.unauthorized(res, "Invalid or expired tokens. Please login again.");
        }

        const userData = userToken.verifyRefreshToken(refreshToken);

        if (!userData) {
            log.error("Invalid or expired refresh token.");
            return exceptions.unauthorized(res, "Invalid or expired refresh token.");
        }

        // Générer un nouveau access token
        userData.password = "";
        const newAccessToken = userToken.accessToken(userData);
        res.setHeader('authorization', `Bearer ${newAccessToken}`);

        // Mettre à jour le refresh token
        refreshToken = userToken.refreshToken(userData);
        res.clearCookie('refresh_key', {
            secure: envs.JWT_COOKIE_SECURITY,
            httpOnly: envs.JWT_COOKIE_HTTP_STATUS,
            sameSite: 'strict',
        });
        res.cookie('refresh_key', refreshToken, {
            httpOnly: envs.JWT_COOKIE_HTTP_STATUS,
            secure: envs.JWT_COOKIE_SECURITY,
            maxAge: envs.JWT_COOKIE_DURATION,
            sameSite: 'strict',
        });
        log.info("generate new refresh token");

        const newUserData = userToken.verifyAccessToken(newAccessToken);
        if (!newUserData) {
            log.error("Failed to decode the new access token");
            return exceptions.unauthorized(res, "Failed to decode the new access token.");
        }

        req.employee = newUserData;
        return next();
    } catch (error) {
        log.error(error);
        res
            .status(HttpCode.INTERNAL_SERVER_ERROR)
            .json({ msg: "Authentication error." });
    }
};

export default authUser;