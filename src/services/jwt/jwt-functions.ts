import jwt from "jsonwebtoken"
import { envs } from "../../core/config/env";
import log from "@src/core/config/logger";
import { IEmployee } from "@src/core/interfaces/interfaces";
import keys from "@src/core/config/key";

const userToken = {
    accessToken: (payload): string => {
        const signOption = {
            algorithm: envs.JWT_ALGORITHM as jwt.Algorithm,
            expiresIn: envs.JWT_ACCESS_EXPIRES_IN as string
        }

        return jwt.sign(payload, keys.jwt.privateKey, signOption) as string;
    },

    verifyAccessToken: (token: string) => {
        try {
            return jwt.verify(token, keys.jwt.publicKey) as IEmployee;
        } catch (error) {
            log.error(`Invalide access token: ${error}`)
            throw new Error(`Failed to verify access token`);;
        }
    },

    refreshToken: (payload): string => {
        const signOption = {
            algorithm: envs.JWT_ALGORITHM as jwt.Algorithm,
            expiresIn: envs.JWT_REFRESH_EXPIRES_IN as string
        };

        return jwt.sign(payload, keys.jwt.refreshPrivateKey, signOption);
    },

    verifyRefreshToken: (refreshToken: string) => {
        try {
            return jwt.verify(refreshToken, keys.jwt.refreshPublicKey) as IEmployee;
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