import { Request } from "express";
import {
    KeySetting,
    RoleUser,
    Employee
} from "@prisma/client";

export type IConfigCache = {
    [key in KeySetting]: string | number | string[];
}

export type IEmployeeJwt = Employee & { iat?: number; exp?: number };
export interface customRequest extends Request {
    employee?: Employee;
}
export interface IResponse<T = any> {
    success: boolean,
    msg: string,
    data?: T
}

export interface IDataInscription {
    name: string,
    email: string,
    password: string,
    post: string,
    salary: number,
    role?: RoleUser;
}

export interface IDataConnexion {
    email: string,
    password: string,
}

export interface IPagination {
    page?: string,
    limit?: string
}

export interface IUpdateEmployee {
    name?: string,
    email?: string,
    post?: string,
    salary?: number;
    role?: RoleUser;
    profileImage?: string;
    updatedAt?: Date;
}    

export interface IDataChangePassword {
    oldPassword: string,
    newPassword: string,
}

export interface IDataResetPassword {
    email: string,
    newpassword: string,
}

export interface IDataOTP {
    email: string,
    otp: string,
}

export interface IResendOTP {
    email: string,
}
