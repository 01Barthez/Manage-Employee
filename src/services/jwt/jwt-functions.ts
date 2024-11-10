import jwt from "jsonwebtoken"
import { envs } from "../../core/config/env";
import keys from "@src/core/config/key";
import { Employee } from "@prisma/client";
import { IEmployeeJwt } from "@src/core/interfaces/interfaces";

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
            return jwt.verify(token, keys.jwt.publicKey) as IEmployeeJwt;
        } catch (error) {
            throw new Error(`Failed to verify access token: ${error}`);
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
            return jwt.verify(refreshToken, keys.jwt.refreshPublicKey) as IEmployeeJwt;
        } catch (error) {
            throw new Error(`Failed to verify refresh token: ${error}`);
        }
    },

    decodeToken: (token: string) => {
        try {
            return jwt.decode(token) as IEmployeeJwt;
        } catch (error) {
            throw new Error(`Failed to decode token: ${error}`);
        }
    },
};

export default userToken;