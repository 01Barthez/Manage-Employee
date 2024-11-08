import jwt from "jsonwebtoken"
import { envs } from "../../core/config/env";
import keys from "@src/core/config/key";
import { Employee } from "@prisma/client";
import throwError from "@src/utils/errors/throwError";

const userToken = {
    accessToken: (payload: Employee): string => {
        const signOption = {
            algorithm: envs.JWT_ALGORITHM as jwt.Algorithm,
            expiresIn: envs.JWT_ACCESS_EXPIRES_IN as string
        }

        return jwt.sign(payload, keys.jwt.privateKey, signOption) as string;
    },

    verifyAccessToken: (token: string) => {
        try {
            return jwt.verify(token, keys.jwt.publicKey) as Employee;
        } catch (error) {
            throwError('Failed to verify access token', error);
        }
    },

    refreshToken: (payload: Employee): string => {
        const signOption = {
            algorithm: envs.JWT_ALGORITHM as jwt.Algorithm,
            expiresIn: envs.JWT_REFRESH_EXPIRES_IN as string
        };

        return jwt.sign(payload, keys.jwt.refreshPrivateKey, signOption);
    },

    verifyRefreshToken: (refreshToken: string) => {
        try {
            return jwt.verify(refreshToken, keys.jwt.refreshPublicKey) as Employee;
        } catch (error) {
            throwError('Failed to verify refresh token', error);
        }
    },

    decodeToken: (token: string) => {
        try {
            return jwt.decode(token) as Employee;
        } catch (error) {
            throwError(`Failed to decode refresh token`, error);
        }
    },
};

export default userToken;