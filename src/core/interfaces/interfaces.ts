import { Request } from "express";

export interface IEmployee {
    employee_id: string;
    name: string;
    email: string;
    password: string;
    otp?: Otp;
    verified: boolean;
    post: string;
    salary: number;
    role: RoleUser;
    attendances: unknown[];
    absences: unknown[];

    // Signature ajouter lors de la signature jwt
    iat?: number;
    exp?: number;
}

export interface Otp {
    code: string;
    expire_at: Date;
}

export interface customRequest extends Request {
    employee?: IEmployee;
}

export enum RoleUser {
    admin = "admin",
    user = "user",
}