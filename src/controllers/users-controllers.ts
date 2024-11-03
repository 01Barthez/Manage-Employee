import { envs } from "@src/core/config/env";
import log from "@src/core/config/logger";
import prisma from "@src/core/config/prismaClient";
import { HttpCode } from "@src/core/constant";
import { customRequest } from "@src/core/interfaces/interfaces";
import { comparePassword, hashText } from "@src/functions/crypt-password";
import generateSimpleOTP from "@src/functions/generate-otp";
import employeeToken from "@src/services/jwt/jwt-functions";
import sendMail from "@src/services/mail/sendMail/send-mail";
import exceptions from "@src/utils/errors/exceptions";
import { Request, Response } from "express";

const employeesControllers = {
    // function for inscription of employee
    inscription: async (req: Request, res: Response) => {
        try {
            // fetch data from body to create new employee
            const { name, email, password, post, salary, role } = req.body;
            if (!name || !email || !password || !post || !salary) {
                log.warn("you have to enter all fields !");
                return exceptions.badRequest(res, "All fields are mandatory !");
            }
            log.info("Informations entrés...");

            // Check if employee ever exist
            const employeeAlreadyExist = await prisma.employee.findUnique({ where: { email } })
            if (employeeAlreadyExist) {
                log.warn(`This email: ${email} is ever use by another employee`)
                return exceptions.conflict(res, "Email is ever used !");
            }
            log.info("Email is Unique");

            log.debug("Debut du hashage du mot de passe//");
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

            const newemployee = await prisma.employee.create({
                data: {
                    name,
                    email,
                    password: hashPassword,
                    otp: {
                        code: otp,
                        expire_at: expireOTP
                    },
                    post, 
                    salary: parseInt(salary),
                    role
                }
            });
            if (!newemployee) {
                log.warn(`Failed to created employee: email: ${email}\n name: ${name}`)
                return exceptions.badRequest(res, "Error when creating new employee !");
            }

            sendMail(
                newemployee.email, // Receiver Email
                'Welcome to Worketyamo Workplace', // Subjet
                'otp', // Template
                { // Template Data
                    date: now,
                    name: newemployee.name,
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
            log.error("error when creating new employee !");
            return exceptions.serverError(res, error);
        }
    },

    // function for connexion of employee
    connexion: async (req: Request, res: Response) => {
        try {
            // fetch data from body
            const { email, password } = req.body;

            if (!email || !password) {
                log.warn("you have to enter all field !");
                return exceptions.badRequest(res, "All fields are mandatory !");
            }
            log.info("Informations entrés...");

            // check if employee exist
            const employee = await prisma.employee.findUnique({ where: { email } });
            if (!employee) {
                log.warn(`employee with email: ${email} not exist !`);
                return exceptions.notFound(res, "employee not exist !");
            }
            log.info("employee exist...");

            // Check if it's correct password
            const isPassword = await comparePassword(password, employee.password);
            if (!isPassword) {
                log.warn(`provided password is incorrect !`);
                return exceptions.unauthorized(res, "incorrect password !");
            }
            log.info("It's correct password...");

            // Save access token and refresh token
            employee.password = "";

            const accessToken = employeeToken.accessToken(employee);
            const refreshToken = employeeToken.refreshToken(employee);
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
            log.info("employee connected...");
            res
                .status(HttpCode.OK)
                .json({ msg: "employee connected !" })
        } catch (error) {
            log.error(`Failed to connect employee !`);
            return exceptions.serverError(res, error);
        }
    },

    // function for deconnexion of employee 
    deconnexion: async (req: customRequest, res: Response) => {
        try {
            // fetch employeID from authentication
            const employeeID = req.employee?.employee_id;
            if (!employeeID) {
                log.warn("Authentication error: No employeeID found in request")
                return exceptions.unauthorized(res, "authentication error !");
            }
            log.info("employee exist...");

            // Check if employee employee exist
            const employee = await prisma.employee.findUnique({ where: { employee_id: employeeID } })
            if (!employee) {
                log.warn(`employee with id: ${employeeID} not exist !`);
                return exceptions.notFound(res, "employee not exist !");
            }
            log.info("employee exist...");

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
            log.info(`access token remove and refresh token clear for employeeID: ${employeeID}`)

            // Return success message
            log.info(`employee ${employee.name} deconnected successfully !`)
            res
                .status(HttpCode.OK)
                .json({ msg: "employee disconnected !" })
        } catch (error) {
            log.error("error occured when try to deconnect employee !")
            return exceptions.serverError(res, error);
        }
    },

    // function to consult employees
    consulteEmployee: async (req: Request, res: Response) => {
        try {
            const { employeeID } = req.params
            if (!employeeID) {
                log.warn("Should provide employeeID");
                return exceptions.badRequest(res, "No employeeID provide !");
            }
            log.info("employeeID is provided...");

            // check if employee exist
            const employee = await prisma.employee.findUnique({ where: { employee_id: employeeID } });
            if (!employee) {
                log.warn(`employee with id: ${employeeID} not exist !`);
                return exceptions.notFound(res, "employee not exist !");
            }
            log.info("employee exist...");

            const infoemployee = {
                name: employee.name,
                email: employee.email,
                post: employee.post, 
                salary: employee.salary
            }

            // Return success message
            log.info("success operation !")
            res
                .status(HttpCode.OK)
                .json({ msg: infoemployee })
        } catch (error) {
            log.error("error occured when try to consult employee !")
            return exceptions.serverError(res, error);
        }
    },

    // function to consult employees
    consulteAllEmployees: async (req: Request, res: Response) => {
        try {
            const employees = await prisma.employee.findMany({
                select: {
                    name: true, email: true, post: true, salary: true
                }
            });
            if (!employees) {
                log.warn(`Failed to fetch all employee !`);
                return exceptions.notFound(res, "failed to fetch all employees !");
            }
            log.info("fetching employees...");

            // Return success message
            log.info("success operation !")
            res
                .status(HttpCode.OK)
                .json({ msg: employees })
        } catch (error) {
            log.error("error occured when try to fetch all employees !")
            return exceptions.serverError(res, error);
        }
    },

    // function to update employee 
    updateEmployeeData: async (req: customRequest, res: Response) => {
        try {
            // fetch employeID from authentication
            const employeeID = req.employee?.employee_id;
            if (!employeeID) {
                log.warn("Authentication error: No employeeID found in request")
                return exceptions.unauthorized(res, "authentication error !");
            }
            log.info("employeeID is provided...");

            // Check if employee employee exist
            const employee = await prisma.employee.findUnique({ where: { employee_id: employeeID } })
            if (!employee) {
                log.warn(`employee with id: ${employeeID} not exist !`);
                return exceptions.notFound(res, "employee not exist !");
            }
            log.info("employee exist...");

            // fetch data from body
            const { name, email, post, salary } = req.body;
            if (!name && !email && !salary) {
                log.warn("you have to enter field to update !");
                return exceptions.badRequest(res, "All fields are mandatory !");
            }
            log.info("Information(s) entrées...");

            // Vérifier si le nouvel email est déjà utilisé par un autre utilisateur
            if (email && email !== employee.email) {
                const emailExists = await prisma.employee.findUnique({
                    where: { email },
                    select: { employee_id: true } // On récupère uniquement l'ID pour voir si un utilisateur existe
                });

                if (emailExists) {
                    log.warn("Email is ever used by another employee !")
                    return exceptions.conflict(res, "Email already in use by another employee!");
                }
            }
            log.info("email is unique...");

            // Update employee
            const updateemployee = await prisma.employee.update({
                where: { employee_id: employeeID },
                data: { name, post, salary: parseInt(salary)},
                select: { name: true, email: true, post: true, salary: true }
            });
            if (!updateemployee) {
                log.warn("error when update employee !");
                return exceptions.badRequest(res, "error when update employee !");
            }

            // Return success message
            log.info("all is done !");
            res
                .status(HttpCode.CREATED)
                .json({ msg: `${employee.name} has been modified successfuly. It's become:`, updateemployee })
        } catch (error) {
            log.error("error occured when try to deconnect employee !")
            return exceptions.serverError(res, error);
        }
    },

    // function to delete employee 
    deleteEmployee: async (req: customRequest, res: Response) => {
        try {
            // fetch employeeID from authentication
            const employeeID = req.employee?.employee_id;
            if (!employeeID) {
                log.warn("Authentication error: No employeeID found in request")
                return exceptions.unauthorized(res, "authentication error !");
            }
            log.info("employeeID is provided...");

            // Check if employee exists
            const employee = await prisma.employee.findUnique({ where: { employee_id: employeeID } })
            if (!employee) {
                log.warn(`employee not found: is it the employeeID is correct ? employeeID: ${employeeID}`);
                return exceptions.notFound(res, "employee not found !");
            }
            log.info("employee exist...");

            // Delete the employee
            const deleteemployee = await prisma.employee.delete({
                where: {
                    employee_id: employeeID
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
            log.info(`access token remove and refresh token clear for employeeID: ${employeeID}`)

            // Return success message
            log.info(`employee ${deleteemployee.name} deleted successfully;`)
            res
                .status(HttpCode.OK)
                .json({ msg: `${deleteemployee.name} has been successfuly deleted!` })
        } catch (error) {
            log.error(`Error when deleting employee!`)
            return exceptions.serverError(res, error);
        }
    },

    // Reset Password
    changePassword: async (req: customRequest, res: Response) => {
        try {
            // fetch employeeID from authentication
            const employeeID = req.employee?.employee_id;
            if (!employeeID) {
                log.warn("Authentication error: No employeeID found in request")
                return exceptions.unauthorized(res, "authentication error !");
            }
            log.info("employeeID is provided...");

            const {oldPassword, newpassword } = req.body;
            if (!oldPassword || !newpassword) {
                log.warn("you have to enter all fields !");
                return exceptions.badRequest(res, "All fields are mandatory !");
            }
            log.info("Information(s) entrées...");

            // check if employee exist
            const employee = await prisma.employee.findUnique({ where: {employee_id: employeeID} });
            if (!employee) {
                log.warn(`employee not found: is it the employeeID is correct ? employeeID: ${employeeID}`);
                return exceptions.notFound(res, "employee not found !");
            }
            log.info("employee exist...");

            if (!(await comparePassword(oldPassword, employee.password))) {
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

            await prisma.employee.update({
                where: { employee_id: employeeID },
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
            log.error("error occured when try to change employee password !")
            return exceptions.serverError(res, error);
        }
    },

    // Reset Password
    resetPassword: async (req: customRequest, res: Response) => {
        try {
             // fetch employeeID from authentication
             const employeeID = req.employee?.employee_id;
             if (!employeeID) {
                 log.warn("Authentication error: No employeeID found in request")
                 return exceptions.unauthorized(res, "authentication error !");
             }
             log.info("employeeID is provided...");

             const {newpassword } = req.body;
            if (!newpassword) {
                log.warn("you have to enter new password !");
                return exceptions.badRequest(res, "new password is mandatory !");
            }
            log.info("Information(s) entrées...");

            // check if employee exist
            const employee = await prisma.employee.findUnique({ where: { employee_id: employeeID } });
            if (!employee) {
                log.warn(`employee not found: is it the employeeID is correct ? employeeID: ${employeeID}`);
                return exceptions.notFound(res, "employee not found !");
            }
            log.info("employee exist...");

            const hashPassword = await hashText(newpassword);
            if (!hashPassword) {
                log.warn(`Failed to hash the password!`)
                return exceptions.badRequest(res, "error trying to crypt password !");
            }
            log.info("Mot de passe hashé...");

            await prisma.employee.update({
                where: { employee_id: employeeID },
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
            log.error("error occured when try to deconnect employee !")
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

            // check if employee exist
            const employee = await prisma.employee.findUnique({ where: { email } });
            if (!employee) {
                log.warn(`employee not found: is it the email is correct ? Email: ${email}`);
                return exceptions.notFound(res, "employee not found !");
            }
            log.info("employee exist...");

            // Check if otp have ever expired
            const now = new Date();
            if (employee.otp && employee.otp.expire_at > now) {
                log.warn("Your token has ever exipired !");
                return exceptions.unauthorized(res, 'Your token have ever expired !');
            }
            log.info("otp has not yet expired...");

            // Check if he was ever verified
            if (employee.verified === true) {
                log.warn("You have ever signin !")
                return exceptions.unauthorized(res, 'Your have ever sign in !');
            }
            log.info("employee has not verified before...");

            // Check if it's the correct otp
            if (employee.otp !== otp) {
                log.warn("Incorrect otp !")
                return exceptions.unauthorized(res, 'Incorect token !');
            }
            log.info("OTP is correct !")

            // Invalid status
            await prisma.employee.update({
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

    // Resend OTP to the employee
    resendOTP: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            if (!email) {
                log.warn("you have to enter email !");
                return exceptions.badRequest(res, "email is mandatory !");
            }
            log.info("email entré...");

            // check if employee exist
            const employee = await prisma.employee.findUnique({ where: { email } });
            if (!employee) {
                log.warn(`employee not found: is it the email is correct ? Email: ${email}`);
                return exceptions.notFound(res, "employee not found !");
            }
            log.info("employee exist...");

            const otp = generateSimpleOTP();
            const now = new Date();
            const expireOTP = new Date(now.getTime() + 10 * 60)
            log.info("new OTP generated !")

            const newemployee = await prisma.employee.update({
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
            if (!newemployee) {
                log.warn("Error when creating generate otp !")
                return exceptions.notFound(res, "Error when creating generate otp !");
            }

            sendMail(
                newemployee.email, // Receiver Email
                '*********', // Subjet
                'otp', // Template
                { // Template Data
                    date: now,
                    name: newemployee.name,
                    otp: otp,
                }
            )
            log.info("otp send to employee...")

            // Return success message
            log.info("operation completed...")
            res
                .status(HttpCode.CREATED)
                .json({ msg: "OTP regenerer !" })
        } catch (error) {
            log.error("error occured when try to deconnect employee !")
            return exceptions.serverError(res, error);
        }
    },

    // Fonction qui va se charger de supprimer tous les otp mis a null a minuit tous les jours
    DeleteUNVERIFIED: async () => {
        try {
            await prisma.employee.deleteMany({ where: { verified: false } });
        } catch (error) {
            log.error('Failed to delete unverified employees:', {
                message: error instanceof Error ? error.message : "Unknown error occurred",
            });
            throw new Error(error instanceof Error ? error.message : "Unknow error occured");
        }
    }
}
export default employeesControllers;