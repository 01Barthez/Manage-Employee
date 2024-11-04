import jwt from "jsonwebtoken"
import { readFileSync } from "fs";
import { envs } from "../../core/config/env";
import log from "@src/core/config/logger";
import { IEmployee } from "@src/core/interfaces/interfaces";

// Download all The keys at the beginin of our program
const privateKey = readFileSync(envs.JWT_PRIVATE_KEY as string, "utf-8");
const publicKey = readFileSync(envs.JWT_PUBLIC_KEY as string, "utf-8");
const RefreshprivateKey = readFileSync(envs.JWT_REFRESH_PRIVATE_KEY as string, "utf-8");
const RefreshpublicKey = readFileSync(envs.JWT_REFRESH_PUBLIC_KEY as string, "utf-8");

const userToken = {
    accessToken: (payload): string => {
        const signOption = {
            algorithm: envs.JWT_ALGORITHM as jwt.Algorithm,
            expiresIn: envs.JWT_ACCESS_EXPIRES_IN as string
        } 

        // log.info("Debut de la generation de l'access token...")
        // log.debug(`Vérification du payload : ${payload}`);
        // log.debug(`Clé privée utilisée : ${privateKey}`);
        // log.debug(`algorithme: ${signOption.algorithm}`)
        // log.debug(`expires duration: ${signOption.expiresIn}`)

        return jwt.sign(payload, privateKey, signOption) as string;
    },

    verifyAccessToken: (token: string) => {
        try {
            // log.info("Debut de la verification du refresh token...")
            // log.debug(`Vérification du jeton : ${token}`);
            // log.debug(`Clé publique utilisée : ${publicKey}`);
            // log.debug(`algorithme: ${envs.JWT_ALGORITHM}`)
            // log.debug(`expires duration: ${envs.JWT_ACCESS_EXPIRES_IN}`)

            return jwt.verify(token, publicKey) as IEmployee;
        } catch (error) {
            log.error(`Invalide access token: ${error}`)
            throw new Error(`Failed to verify access token`);;
        }
    },

    // REFRESH TOKEN ET SES FONCTIONS
        refreshToken: (payload): string => {
        const signOption = {
            algorithm: envs.JWT_ALGORITHM as jwt.Algorithm,
            expiresIn: envs.JWT_REFRESH_EXPIRES_IN as string
        };

        return jwt.sign(payload, RefreshprivateKey, signOption);
    },

    verifyRefreshToken: (refreshToken: string) => {
        try {
            return jwt.verify(refreshToken, RefreshpublicKey) as IEmployee;
        } catch (error) {
            log.error(`token invalide: ${error}`);
            throw new Error(`Failed to verify refresh token`);;
        }
    },

    decodeToken: (token: string) => {
        try {
            return jwt.decode(token) as IEmployee;
        } catch (error) {
            log.error(`token invalide: ${error}`);
            throw new Error(`Failed to decode refresh token`);;
        }
    },
};

export default userToken;