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

export interface IUpdateEmployee {
    name?: string,
    email?: string,
    post?: string,
    salary?: number;
    role?: RoleUser;
    profileImage?: string;
    updatedAt?: Date;
}

export interface customRequest extends Request {
    employee?: Employee;
}
export interface IResponse<T=any> {
    success: boolean,
    msg: string,
    data?: T
}
