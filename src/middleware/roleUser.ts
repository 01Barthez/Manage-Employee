import { NextFunction, Response } from "express";
import exceptions from "../utils/errors/exceptions";
import prisma from "../core/config/prismaClient";
import { customRequest, RoleUser } from "../core/interfaces/interfaces";

const roleUser = async (
        req: customRequest, 
        res: Response,
        next: NextFunction,
        role: RoleUser
    ) =>
{
    try {
        // fetch employeID from authentification
        const userID = req.user?.user_id;
        if(!userID) return exceptions.unauthorized(res, "authentification error !");

        // Check if user user exist
        const user = await prisma.user.findUnique({where: {user_id: userID}})
        if(!user) return exceptions.badRequest(res, "user not found !");
    
        if(user.role !== role) return exceptions.forbiden(res, "You are not allow to do this action !");
        
        next()
    } catch (error) {
        return exceptions.serverError(res, error);
    }
}

export default roleUser;