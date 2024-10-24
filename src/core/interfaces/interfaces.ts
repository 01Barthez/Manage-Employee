import { Request } from "express";

export interface IUser {
    user_id: string;
    name: string;
    email: string;
    password: string;
    verified: boolean;
    role: $Enums.RoleUser;
    otp: {
        code: string;
        expire_at: Date;
    } | null;
}

export interface IObjet {
    objet_id: string;
    title: string;
    content: string;
    slug: string
    createdAt: Date;
}

export interface customRequest extends Request {
    user?: IUser;
}

export enum RoleUser {
    admin = "admin",
    user = "user",
}