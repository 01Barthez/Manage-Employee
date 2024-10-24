import { envs } from "@src/core/config/env";
import log from "@src/core/config/logger";
import prisma from "@src/core/config/prismaClient";
import { HttpCode } from "@src/core/constant";
import { customRequest } from "@src/core/interfaces/interfaces";
import { comparePassword, hashText } from "@src/functions/crypt-password";
import generateSimpleOTP from "@src/functions/generate-otp";
import userToken from "@src/services/jwt/jwt-functions";
import sendMail from "@src/services/mail/sendMail/send-mail";
import exceptions from "@src/utils/errors/exceptions";
import { Request, Response } from "express";

const usersControllers = {
    // function for inscription of user
    inscription: async (req: Request, res: Response) => {
        try {
            // fetch data from body to create new user
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                log.warn("you have to enter all field !");
                return exceptions.badRequest(res, "All fields are mandatory !");
            }
            log.info("Informations entrés...");

            // Check if user ever exist
            const userAlreadyExist = await prisma.user.findUnique({ where: { email } })
            if (userAlreadyExist) {
                log.warn(`This email: ${email} is ever use by another user`)
                return exceptions.conflict(res, "Email is ever used !");
            }
            log.info("Email Unique");

            const hashPassword = await hashText(password);
            if (!hashPassword) {
                log.warn(`Failed to hash the password!`)
                return exceptions.badRequest(res, "error trying to crypt password !");
            }
            log.info("Mot de passe hashé...");

            const otp = generateSimpleOTP();
            const now = new Date();
            const expireOTP = new Date(now.getTime() + 10 * 60)
            log.info("code OTP généré...")

            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashPassword,
                    otp: {
                        code: otp,
                        expire_at: expireOTP
                    },
                }
            });
            if (!newUser) {
                log.warn(`Failed to created user: email: ${email}\n name: ${name}`)
                return exceptions.badRequest(res, "Error when creating new user !");
            }

            sendMail(
                newUser.email, // Receiver Email
                'Welcome to blog *****', // Subjet
                'otp', // Template
                { // Template Data
                    date: now,
                    name: newUser.name,
                    otp: otp,
                }
            )
            log.info(`Email envoyé à l'utilisateur: ${email}`)

            // Return success message
            log.info("Utilisateur créé");
            res
                .status(HttpCode.CREATED)
                .json({ msg: "registration completed !" })
        } catch (error) {
            log.error("error when creating new user !");
            return exceptions.serverError(res, error);
        }
    },

    // function for connexion of user
    connexion: async (req: Request, res: Response) => {
        try {
            // fetch data from body
            const { email, password } = req.body;

            if (!email || !password) {
                log.warn("you have to enter all field !");
                return exceptions.badRequest(res, "All fields are mandatory !");
            }
            log.info("Informations entrés...");

            // check if user exist
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                log.warn(`User with email: ${email} not exist !`);
                return exceptions.notFound(res, "user not exist !");
            }
            log.info("User exist...");

            // Check if it's correct password
            const isPassword = await comparePassword(password, user.password);
            if (!isPassword) {
                log.warn(`provided password is incorrect !`);
                return exceptions.unauthorized(res, "incorrect password !");
            }
            log.info("It's correct password...");

            // Save access token and refresh token
            user.password = "";

            const accessToken = userToken.accessToken(user);
            const refreshToken = userToken.refreshToken(user);
            log.info("generate access an refresh token...");

            res.setHeader('authorization', `Bearer ${accessToken}`);
            log.info("save access token in header authorisation...");

            res.cookie(
                `refresh_key`,
                refreshToken,
                {
                    httpOnly: envs.JWT_COOKIE_HTTP_STATUS,
                    secure: envs.JWT_COOKIE_SECURITY,
                    maxAge: envs.JWT_COOKIE_DURATION,
                    sameSite: 'strict',
                }
            );
            log.info("save access token in cookie...");

            // Return success message
            log.info("user connected...");
            res
                .status(HttpCode.OK)
                .json({ msg: "user connected !" })
        } catch (error) {
            log.error(`Failed to connect user !`);
            return exceptions.serverError(res, error);
        }
    },

    // function for deconnexion of user 
    deconnexion: async (req: customRequest, res: Response) => {
        try {
            // fetch employeID from authentication
            const userID = req.user?.user_id;
            if (!userID) {
                log.warn("Authentication error: No userID found in request")
                return exceptions.unauthorized(res, "authentication error !");
            }
            log.info("User exist...");

            // Check if user user exist
            const user = await prisma.user.findUnique({ where: { user_id: userID } })
            if (!user) {
                log.warn(`User with id: ${userID} not exist !`);
                return exceptions.notFound(res, "user not exist !");
            }
            log.info("User exist...");

            // remove access token and clear refresh tooken in cookie for security... 
            res.setHeader('authorization', ``);
            res.removeHeader('authorization');
            res.clearCookie(
                `refresh_key`,
                {
                    secure: envs.JWT_COOKIE_SECURITY,
                    httpOnly: envs.JWT_COOKIE_HTTP_STATUS,
                    sameSite: "strict"
                }
            )
            log.info(`access token remove and refresh token clear for userID: ${userID}`)

            // Return success message
            log.info(`User ${user.name} deconnected successfully !`)
            res
                .status(HttpCode.OK)
                .json({ msg: "user disconnected !" })
        } catch (error) {
            log.error("error occured when try to deconnect user !")
            return exceptions.serverError(res, error);
        }
    },

    // function to consult users
    consultuser: async (req: Request, res: Response) => {
        try {
            const { userID } = req.params
            if (!userID) {
                log.warn("Should provide UserID");
                return exceptions.badRequest(res, "No UserID provide !");
            }
            log.info("UserID is provided...");

            // check if user exist
            const user = await prisma.user.findUnique({ where: { user_id: userID } });
            if (!user) {
                log.warn(`User with id: ${userID} not exist !`);
                return exceptions.notFound(res, "user not exist !");
            }
            log.info("User exist...");

            const infoUser = {
                name: user.name,
                email: user.email,
            }

            // Return success message
            log.info("success operation !")
            res
                .status(HttpCode.OK)
                .json({ msg: infoUser })
        } catch (error) {
            log.error("error occured when try to deconnect user !")
            return exceptions.serverError(res, error);
        }
    },

    // function to update user 
    updateUserData: async (req: customRequest, res: Response) => {
        try {
            // fetch employeID from authentication
            const userID = req.user?.user_id;
            if (!userID) {
                log.warn("Authentication error: No userID found in request")
                return exceptions.unauthorized(res, "authentication error !");
            }
            log.info("UserID is provided...");

            // Check if user user exist
            const user = await prisma.user.findUnique({ where: { user_id: userID } })
            if (!user) {
                log.warn(`User with id: ${userID} not exist !`);
                return exceptions.notFound(res, "user not exist !");
            }
            log.info("User exist...");

            // fetch data from body
            const { name, email } = req.body;
            if (!name && !email) {
                log.warn("you have to enter field to update !");
                return exceptions.badRequest(res, "All fields are mandatory !");
            }
            log.info("Information(s) entrées...");

            // Vérifier si le nouvel email est déjà utilisé par un autre utilisateur
            if (email && email !== user.email) {
                const emailExists = await prisma.user.findUnique({
                    where: { email },
                    select: { user_id: true } // On récupère uniquement l'ID pour voir si un utilisateur existe
                });

                if (emailExists) {
                    log.warn("Email is ever used by another user !")
                    return exceptions.conflict(res, "Email already in use by another user!");
                }
            }
            log.info("email is unique...");

            // Update user
            const updateuser = await prisma.user.update({
                where: { user_id: userID },
                data: { name, email },
                select: { name: true, email: true }
            });
            if (!updateuser) {
                log.warn("error when update user !");
                return exceptions.badRequest(res, "error when update user !");
            }

            // Return success message
            log.info("all is done !");
            res
                .status(HttpCode.CREATED)
                .json({ msg: `${user.name} has been modified successfuly. It's become:`, updateuser })
        } catch (error) {
            log.error("error occured when try to deconnect user !")
            return exceptions.serverError(res, error);
        }
    },

    // function to delete user 
    deleteUser: async (req: customRequest, res: Response) => {
        try {
            // fetch UserID from authentication
            const userID = req.user?.user_id;
            if (!userID) {
                log.warn("Authentication error: No userID found in request")
                return exceptions.unauthorized(res, "authentication error !");
            }
            log.info("UserID is provided...");

            // Check if user exists
            const user = await prisma.user.findUnique({ where: { user_id: userID } })
            if (!user) {
                log.warn(`user not found: is it the userID is correct ? userID: ${userID}`);
                return exceptions.notFound(res, "user not found !");
            }
            log.info("user exist...");

            // Delete the user
            const deleteUser = await prisma.user.delete({
                where: {
                    user_id: userID
                }
            });

            // remove access token and clear refresh tooken in cookie for security... 
            res.setHeader('authorization', ``);
            res.removeHeader('authorization');
            res.clearCookie(
                `refresh_key`,
                {
                    secure: envs.JWT_COOKIE_SECURITY,
                    httpOnly: envs.JWT_COOKIE_HTTP_STATUS,
                    sameSite: "strict"
                }
            )
            log.info(`access token remove and refresh token clear for userID: ${userID}`)

            // Return success message
            log.info(`User ${deleteUser.name} deleted successfully;`)
            res
                .status(HttpCode.OK)
                .json({ msg: `${deleteUser.name} has been successfuly deleted!` })
        } catch (error) {
            log.error(`Error when deleting user!`)
            return exceptions.serverError(res, error);
        }
    },

    // Reset Password
    changePassword: async (req: customRequest, res: Response) => {
        try {
            // fetch UserID from authentication
            const userID = req.user?.user_id;
            if (!userID) {
                log.warn("Authentication error: No userID found in request")
                return exceptions.unauthorized(res, "authentication error !");
            }
            log.info("UserID is provided...");

            const {oldPassword, newpassword } = req.body;
            if (!oldPassword || !newpassword) {
                log.warn("you have to enter all fields !");
                return exceptions.badRequest(res, "All fields are mandatory !");
            }
            log.info("Information(s) entrées...");

            // check if user exist
            const user = await prisma.user.findUnique({ where: {user_id: userID} });
            if (!user) {
                log.warn(`user not found: is it the userID is correct ? userID: ${userID}`);
                return exceptions.notFound(res, "user not found !");
            }
            log.info("user exist...");

            if (!(await comparePassword(oldPassword, user.password))) {
                log.warn("Incorrect password !");
                return exceptions.badRequest(res, "Incorrect password !");
            }
            log.info("Mot de passe correct... !");

            const hashPassword = await hashText(newpassword);
            if (!hashPassword) {
                log.warn(`Failed to hash the password!`)
                return exceptions.badRequest(res, "error trying to crypt password !");
            }
            log.info("Mot de passe hashé...");

            await prisma.user.update({
                where: { user_id: userID },
                data: {
                    password: hashPassword,
                }
            });

            // Return success message
            log.info("Password updated !");
            res
                .status(HttpCode.OK)
                .json({ msg: `password successfully changed!` })
        } catch (error) {
            log.error("error occured when try to change user password !")
            return exceptions.serverError(res, error);
        }
    },

    // Reset Password
    resetPassword: async (req: customRequest, res: Response) => {
        try {
             // fetch UserID from authentication
             const userID = req.user?.user_id;
             if (!userID) {
                 log.warn("Authentication error: No userID found in request")
                 return exceptions.unauthorized(res, "authentication error !");
             }
             log.info("UserID is provided...");

             const {newpassword } = req.body;
            if (!newpassword) {
                log.warn("you have to enter new password !");
                return exceptions.badRequest(res, "new password is mandatory !");
            }
            log.info("Information(s) entrées...");

            // check if user exist
            const user = await prisma.user.findUnique({ where: { user_id: userID } });
            if (!user) {
                log.warn(`user not found: is it the userID is correct ? userID: ${userID}`);
                return exceptions.notFound(res, "user not found !");
            }
            log.info("user exist...");

            const hashPassword = await hashText(newpassword);
            if (!hashPassword) {
                log.warn(`Failed to hash the password!`)
                return exceptions.badRequest(res, "error trying to crypt password !");
            }
            log.info("Mot de passe hashé...");

            await prisma.user.update({
                where: { user_id: userID },
                data: {
                    password: hashPassword,
                }
                });

            // Return success message
            log.info("password reset !")
            res
                .status(HttpCode.OK)
                .json({ msg: `password successfully changed!` })
        } catch (error) {
            log.error("error occured when try to deconnect user !")
            return exceptions.serverError(res, error);
        }
    },

    // Verified OTP
    verifyOtp: async (req: Request, res: Response) => {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                log.warn("you have to enter email and otp !");
                return exceptions.badRequest(res, "email and otp are mandatory !");
            }
            log.info("Information(s) entrées...");

            // check if user exist
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                log.warn(`user not found: is it the email is correct ? Email: ${email}`);
                return exceptions.notFound(res, "user not found !");
            }
            log.info("user exist...");

            // Check if otp have ever expired
            const now = new Date();
            if (user.otp && user.otp.expire_at > now) {
                log.warn("Your token has ever exipired !");
                return exceptions.unauthorized(res, 'Your token have ever expired !');
            }
            log.info("otp has not yet expired...");

            // Check if he was ever verified
            if (user.verified === true) {
                log.warn("You have ever signin !")
                return exceptions.unauthorized(res, 'Your have ever sign in !');
            }
            log.info("user has not verified before...");

            // Check if it's the correct otp
            if (user.otp !== otp) {
                log.warn("Incorrect otp !")
                return exceptions.unauthorized(res, 'Incorect token !');
            }
            log.info("OTP is correct !")

            // Invalid status
            await prisma.user.update({
                where: {
                    email
                },
                data: {
                    verified: true,
                }
            });

            log.info("Otp verified ...")
            res
                .status(HttpCode.OK)
                .json({ msg: "Otp verified !" });

        } catch (error) {
            log.error("error occured when try to verified otp !")
            return exceptions.serverError(res, error);
        }
    },

    // Resend OTP to the USER
    resendOTP: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            if (!email) {
                log.warn("you have to enter email !");
                return exceptions.badRequest(res, "email is mandatory !");
            }
            log.info("email entré...");

            // check if user exist
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                log.warn(`user not found: is it the email is correct ? Email: ${email}`);
                return exceptions.notFound(res, "user not found !");
            }
            log.info("user exist...");

            const otp = generateSimpleOTP();
            const now = new Date();
            const expireOTP = new Date(now.getTime() + 10 * 60)
            log.info("new OTP generated !")

            const newUser = await prisma.user.update({
                where: {
                    email
                },
                data: {
                    otp: {
                        code: otp,
                        expire_at: expireOTP
                    }
                }
            });
            if (!newUser) {
                log.warn("Error when creating generate otp !")
                return exceptions.notFound(res, "Error when creating generate otp !");
            }

            sendMail(
                newUser.email, // Receiver Email
                '*********', // Subjet
                'otp', // Template
                { // Template Data
                    date: now,
                    name: newUser.name,
                    otp: otp,
                }
            )
            log.info("otp send to user...")

            // Return success message
            log.info("operation completed...")
            res
                .status(HttpCode.CREATED)
                .json({ msg: "OTP regenerer !" })
        } catch (error) {
            log.error("error occured when try to deconnect user !")
            return exceptions.serverError(res, error);
        }
    },

    // Fonction qui va se charger de supprimer tous les otp mis a null a minuit tous les jours
    DeleteUNVERIFIED: async () => {
        try {
            await prisma.user.deleteMany({ where: { verified: false } });
        } catch (error) {
            log.error('Failed to delete unverified users:', {
                message: error instanceof Error ? error.message : "Unknown error occurred",
            });
            throw new Error(error instanceof Error ? error.message : "Unknow error occured");
        }
    }
}
export default usersControllers;