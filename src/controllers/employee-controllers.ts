import { RoleUser } from "@prisma/client";
import { envs } from "@src/core/config/env";
import log from "@src/core/config/logger";
import prisma from "@src/core/config/prismaClient";
import { HttpCode } from "@src/core/constant";
import employeeToken from "@src/services/jwt/jwt-functions";
import sendMail from "@src/services/mail/sendMail/send-mail";
import { comparePassword, hashText } from "@src/services/security/crypt-password";
import generateSimpleOTP from "@src/services/security/generate-otp";
import exceptions from "@src/utils/errors/exceptions";
import ResponseMSG from "@src/utils/responseformat";
import { Request, Response } from "express";
import uploadImageToCloud from "@src/services/upload/uploadImage";
import { fetchEmployeeFromAuth } from "@src/utils/helpers/fetchEmployee";
import blackListAccessAndRefresToken from "@src/utils/helpers/blackListAccessAndRefresToken";
import { 
    customRequest, 
    IDataChangePassword, 
    IDataConnexion, 
    IDataInscription, 
    IDataOTP, 
    IDataResetPassword, 
    IPagination, 
    IResendOTP, 
    IUpdateEmployee 
} from "@src/core/interfaces/interfaces";


const employeesControllers = {
    // function for inscription of employee
    inscription: async (req: Request, res: Response) => {
        try {
            // fetch data from body to create new employee
            const { name, email, password, post, salary, role } = req.body as IDataInscription;
            if (!name || !email || !password || !post || !salary) {
                log.warn("you have to enter all fields !");
                return exceptions.badRequest(res, "All fields are mandatory !");
            }
            log.info("Informations de creation d'un employé entrés...");

            // Check if employee ever exist
            const employeeAlreadyExist = await prisma.employee.findUnique({
                where: {
                    email,
                    deletedAt: null
                }
            })
            if (employeeAlreadyExist) {
                log.warn(`This email: ${email} is ever use by another employee`)
                return exceptions.conflict(res, "Email is ever used !");
            }
            log.info("Email is Unique");

            log.debug("Begin of hashing password...");
            const hashPassword = await hashText(password);
            if (!hashPassword) {
                log.warn(`Failed to hash the password!`)
                return exceptions.badRequest(res, "error trying to crypt password !");
            }
            log.info("password hashed...");

            // Generer le code otp qu'on va garder
            const otp = generateSimpleOTP() || ``;
            const now = new Date();
            const expireOTP = new Date(now.getTime() + envs.OTP_MAX_AGE)
            log.info("code OTP généré...");

            // sauvegarder l'image et recuperer le lien
            const profileUrl = uploadImageToCloud(req);
            log.info(`url de la photo de profile: ${profileUrl}`);

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
                    salary: Number(salary),
                    role,
                    profileImage: profileUrl
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
                {
                    date: now,
                    name: newemployee.name,
                    otp: otp,
                }
            )
            log.info(`Email envoyé à l'utilisateur: ${email}`)

            // Return success message
            log.info(`Employee created with ID: ${newemployee.employee_id}, OTP sent`);
            res
                .status(HttpCode.CREATED)
                .json(ResponseMSG("registration completed !"))
        } catch (error) {
            log.error("error when creating new employee !");
            return exceptions.serverError(res, error);
        }
    },

    // function for connexion of employee
    connexion: async (req: Request, res: Response) => {
        try {
            // fetch data from body
            const { email, password } = req.body as IDataConnexion;

            if (!email || !password) {
                log.warn("you have to enter all field !");
                return exceptions.badRequest(res, "All fields are mandatory !");
            }
            log.info("Informations de connexion entrés...");

            // check if employee exist
            const employee = await prisma.employee.findUnique({
                where: {
                    email,
                    deletedAt: null
                }
            });
            if (!employee) {
                log.warn(`employee with email: ${email} not exist !`);
                return exceptions.notFound(res, "employee not exist !");
            }
            log.info("employee exist...");

            // Check that's verified user
            if (!employee.verified) {
                log.warn(`employee with email: ${email} should verified his otp before !`);
                return exceptions.unauthorized(res, "Should verified his otp before !");
            }

            // Check if it's correct password
            const isPassword = await comparePassword(password, employee.password);
            if (!isPassword) {
                log.warn(`provided password is incorrect !`);
                return exceptions.unauthorized(res, "incorrect password !");
            }
            log.info("It's correct password...");

            // Save access token and refresh token
            employee.password = "";
            employee.otp = null;

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
            log.info(`employee with ID: ${employee?.employee_id}, connected successfully...`);
            res
                .status(HttpCode.OK)
                .json(ResponseMSG("employee connected !"))
        } catch (error) {
            log.error(`Failed to connect employee !`);
            return exceptions.serverError(res, error);
        }
    },

    // function for deconnexion of employee 
    deconnexion: async (req: customRequest, res: Response) => {
        try {
            // Check if employee exist and fetch his data
            const employee = await fetchEmployeeFromAuth(req, res);

            // BlackList the access and the refresh token of employee
            await blackListAccessAndRefresToken(req, res)
            log.debug(`Access token and refresh token are blacklisted for: ${employee?.employee_id}`);

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
            log.info(`access token remove and refresh token clear for employeeID: ${employee?.employee_id}`)

            // Return success message
            log.info(`employee with ID: ${employee?.employee_id}, disconnected successfully...`)
            res
                .status(HttpCode.OK)
                .json(ResponseMSG("employee disconnected !"))
        } catch (error) {
            log.error("error occured when try to deconnect employee !")
            return exceptions.serverError(res, error);
        }
    },

    // function to consult employees
    consultEmployee: async (req: Request, res: Response) => {
        try {
            const { employeeID } = req.params
            if (!employeeID) {
                log.warn("Should provide employeeID");
                return exceptions.badRequest(res, "No employeeID provide !");
            }
            log.info("employeeID to consult is provided...");

            // check if employee exist
            const employee = await prisma.employee.findUnique({
                where: {
                    employee_id: employeeID,
                    deletedAt: null
                },
                select: {
                    name: true,
                    email: true,
                    profileImage: true,
                    post: true,
                    salary: true
                }
            });
            if (!employee) {
                log.warn(`employee with id: ${employeeID} not exist !`);
                return exceptions.notFound(res, "employee not exist !");
            }
            log.info("employee exist...");

            // Return success message
            log.info("success operation !")
            res
                .status(HttpCode.OK)
                .json(ResponseMSG("success operation", true, employee))
        } catch (error) {
            log.error("error occured when try to consult employee !")
            return exceptions.serverError(res, error);
        }
    },

    // function to consult employees
    consultAllEmployees: async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 10 } = req.query as IPagination;

            const employees = await prisma.employee.findMany({
                where: {
                    deletedAt: null
                },
                select: {
                    name: true,
                    email: true,
                    profileImage: true,
                    post: true,
                    salary: true
                },

                take: Number(limit),
                skip: (Number(page) - 1) * Number(limit),
            });

            if (!employees.length) {
                log.warn(`Failed to fetch all employee !`);
                return exceptions.notFound(res, "failed to fetch all employees !");
            }
            log.info("fetching employees...");

            // Return success message
            log.info("all employee successfully fetch !")
            res
                .status(HttpCode.OK)
                .json(ResponseMSG("operation successfully", true, employees))
        } catch (error) {
            log.error("error occured when try to fetch all employees !")
            return exceptions.serverError(res, error);
        }
    },

      // function to consult all deleted employees
      consultAllDeletedEmployees: async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 10 } = req.query as IPagination;

            // Verified that limit is not too big and reasign it
            const max = envs.MAX_LIMIT_DATA;
            const take = (Number(limit) > max) ? max : Number(limit); 
            
            const employees = await prisma.employee.findMany({
                where: {
                    deletedAt: {
                        not: null
                    }
                },
                select: {
                    name: true,
                    email: true,
                    profileImage: true,
                    post: true,
                    salary: true,
                    createdAt: true,
                    deletedAt: true,
                },
                take,
                skip: (Number(page) - 1) * Number(limit),
            });

            if (!employees.length) {
                log.warn(`Failed to fetch all employee !`);
                return exceptions.notFound(res, "failed to fetch all employees !");
            }
            log.info("fetching employees...");

            // Return success message
            log.info("all employee successfully fetch !")
            res
                .status(HttpCode.OK)
                .json(ResponseMSG("operation successfully", true, employees))
        } catch (error) {
            log.error("error occured when try to fetch all employees !")
            return exceptions.serverError(res, error);
        }
    },

    // function to update employee 
    updatEmployeeData: async (req: customRequest, res: Response) => {
        try {
            // Check if employee exist and fetch his data
            const employee = await fetchEmployeeFromAuth(req, res);

            // fetch data from body
            const { name, email, post, salary, role } = req.body as IUpdateEmployee;
            const updateData: IUpdateEmployee = {}; // Create an object to hold the fields to update

            // Add fields to updateData only if they are provided
            if (name) updateData.name = name;
            if (email) updateData.email = email;
            if (post) updateData.post = post;
            if (salary) updateData.salary = salary;
            if (role) updateData.role = role;

            // sauvegarder l'image et recuperer le lien
            const profileUrl = uploadImageToCloud(req);
            log.info(`url de la photo de profile: ${profileUrl}`);

            if (profileUrl && profileUrl.length > 5) updateData.profileImage = profileUrl;

            // If no fields are provided, return a bad request error
            if (Object.keys(updateData).length === 0) {
                log.warn("No fields provided to update !");
                return exceptions.badRequest(res, "At least one field is required to update !");
            }
            log.info("Information(s) entrées...");

            // Vérifier si le nouvel email est déjà utilisé par un autre utilisateur
            if (email && email !== employee?.email) {
                const emailExists = await prisma.employee.findUnique({
                    where: {
                        email,
                        deletedAt: null
                    }
                });
                if (emailExists) {
                    log.warn("Email is ever used by another employee !")
                    return exceptions.conflict(res, "Email already in use by another employee!");
                }
            }
            log.info("email is unique...");

            // Update employee
            const updateEmployee = await prisma.employee.update({
                where: {
                    employee_id: employee?.employee_id,
                    deletedAt: null
                },
                data: updateData,
                select: {
                    name: true,
                    email: true,
                    profileImage: true,
                    post: true,
                    salary: true,
                }
            });
            if (!updateEmployee) {
                log.warn("error when update employee !");
                return exceptions.badRequest(res, "error when update employee !");
            }

            // Return success message
            log.info(`employee with ID: ${employee?.employee_id}, updated successfully...`);
            res
                .status(HttpCode.OK)
                .json(ResponseMSG("successfull operation", true, updateEmployee))
        } catch (error) {
            log.error("error occured when try to update employee !")
            return exceptions.serverError(res, error);
        }
    },

    // function to delete employee 
    deleteEmployee: async (req: customRequest, res: Response) => {
        try {
            // Check if employee exist and fetch his data
            const employee = await fetchEmployeeFromAuth(req, res);

            // fetch employeeID to delete from params
            const { employeeID } = req.params
            if (!employeeID) {
                log.warn("Should provide employeeID");
                return exceptions.badRequest(res, "No employeeID provide !");
            }
            log.info("employeeID to delete is provided...");

            // Vérification des permissions
            const requesterID = employee?.employee_id; // L'ID de l'utilisateur qui fait la requête
            log.info(`id de celui qui fait la requete: ${requesterID}`);

            const requesterRole = employee?.role; // Le rôle de l'utilisateur qui fait la requête
            log.info(`role de celui qui fait la requete: ${requesterRole}`);

            // Permettre à l'utilisateur de supprimer son propre compte ou à un admin de supprimer n'importe quel compte
            if (requesterID !== employee?.employee_id && (requesterRole !== RoleUser.Admin && requesterRole !== RoleUser.Manager)) {
                log.warn(`Unauthorized attempt to delete employee`);
                return exceptions.forbiden(res, "You are not authorized to delete this account!");
            }

            // Delete the employee
            const deleteemployee = await prisma.employee.update({
                where: {
                    employee_id: employee?.employee_id,
                    deletedAt: null
                },
                data: {
                    deletedAt: new Date(),
                }
            });

            // BlackList the access and the refresh token of employee
            if (requesterID === employee?.employee_id) {  //! Comment faire au cas contraire ?
                await blackListAccessAndRefresToken(req, res)
                log.debug(`Access token and refresh token are blacklisted for: ${deleteemployee.employee_id}`);
            }

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
            log.info(`employee with ID: ${employee?.employee_id}, deleted successfully...`);
            res
                .status(HttpCode.OK)
                .json(ResponseMSG('success operation'))
        } catch (error) {
            log.error(`Error when deleting employee!`)
            return exceptions.serverError(res, error);
        }
    },

    clearDeletedEmployee: async (_req: customRequest, res: Response) => {
        try {
            // clear Delete the employee
            await prisma.employee.deleteMany({
                where: {
                    deletedAt: {
                        not: null
                    }
                }
            });

            // Return success message
            log.info(`deleted employees successfully clear;`);
            res
                .status(HttpCode.OK)
                .json(ResponseMSG('success operation'))

        } catch (error) {
            log.error(`Error when deleting employee!`)
            return exceptions.serverError(res, error);
        }
    },

    // Reset Password
    changePassword: async (req: customRequest, res: Response) => {
        try {
            // Check if employee exist and fetch his data
            const employee = await fetchEmployeeFromAuth(req, res);

            const { oldPassword, newPassword } = req.body as IDataChangePassword;
            if (!oldPassword || !newPassword) {
                log.warn("you have to enter all fields !");
                return exceptions.badRequest(res, "All fields are mandatory !");
            }
            log.info("Information(s) entrées...");

            if (!(await comparePassword(oldPassword, employee?.password || ''))) {
                log.warn("Incorrect password !");
                return exceptions.badRequest(res, "Incorrect password !");
            }
            log.info("Mot de passe correct... !");

            const hashPassword = await hashText(newPassword);
            if (!hashPassword) {
                log.warn(`Failed to hash the password!`)
                return exceptions.badRequest(res, "error trying to crypt password !");
            }
            log.info("Mot de passe hashé...");

            await prisma.employee.update({
                where: {
                    employee_id: employee?.employee_id,
                    deletedAt: null
                },
                data: {
                    password: hashPassword,
                }
            });

            // BlackList the access and the refresh token of employee
            await blackListAccessAndRefresToken(req, res)
            log.debug(`Access token and refresh token are blacklisted for: ${employee?.employee_id}`);

            // Return success message
            log.info(`employee with ID: ${employee?.employee_id}, updated password successfully...`);
            res
                .status(HttpCode.OK)
                .json(ResponseMSG("password successfully changed!"));
        } catch (error) {
            log.error("error occured when try to change employee password !")
            return exceptions.serverError(res, error);
        }
    },

    // Reset Password
    resetPassword: async (req: Request, res: Response) => {
        try {
            const { newpassword, email } = req.body as IDataResetPassword;
            if (!newpassword) {
                log.warn("you have to enter new password !");
                return exceptions.badRequest(res, "new password is mandatory !");
            }
            log.info("Information(s) entrées pour le reset du password...");

            // check if employee exist
            const employee = await prisma.employee.findUnique({ 
                where: { 
                    email, 
                    deletedAt: null
                },
            });
            if (!employee) {
                log.warn(`employee not found: is it the email is correct ? email: ${email}`);
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
                where: { 
                    email, 
                    deletedAt: null
                },
                data: {
                    password: hashPassword,
                }
            });

            // BlackList the access and the refresh token of employee
            await blackListAccessAndRefresToken(req, res)
            log.debug(`Access token and refresh token are blacklisted for: ${employee.employee_id}`);

            // Return success message
            log.info(`employee with ID: ${employee.employee_id}, reset Password successfully...`);
            res
                .status(HttpCode.OK)
                .json(ResponseMSG("password successfully reset"))
        } catch (error) {
            log.error("error occured when try to reset employee password !")
            return exceptions.serverError(res, error);
        }
    },

    // Verified OTP
    verifyOtp: async (req: Request, res: Response) => {
        try {
            const { email, otp } = req.body as IDataOTP;
            if (!email || !otp) {
                log.warn("you have to enter email and otp !");
                return exceptions.badRequest(res, "email and otp are mandatory !");
            }
            log.info("Information(s) ded verification d'otp entrées...");

            // check if employee exist
            const employee = await prisma.employee.findUnique({ 
                where: { 
                    email, 
                    deletedAt: null
                },
            });
            if (!employee) {
                log.warn(`employee not found: is it the email is correct ? Email: ${email}`);
                return exceptions.notFound(res, "employee not found !");
            }
            log.info("employee exist...");

            // Check if otp have ever expired
            const now = new Date();
            log.debug(`date de maintenant: ${now.toISOString()} `)
            log.debug(`date d'expiration: ${employee.otp?.expire_at.toISOString()} `)
            if (employee.otp && now > new Date(employee.otp.expire_at)) {
                log.warn("Your otp has ever exipired !");
                return exceptions.unauthorized(res, 'Your otp have ever expired !');
            }
            log.info("otp has not yet expired...");

            // Check if he was ever verified
            if (employee.verified === true) {
                log.warn("You have ever signin !")
                return exceptions.unauthorized(res, 'Your have ever sign in !');
            }
            log.info("employee has not verified before...");

            // Check if it's the correct otp
            if (employee.otp?.code !== otp) {
                log.warn("Incorrect otp !")
                return exceptions.unauthorized(res, 'Incorect otp !');
            }
            log.info("OTP is correct !")

            // Invalid status
            await prisma.employee.update({
                where: { 
                    email, 
                    deletedAt: null
                },
                data: {
                    verified: true,
                    otp: null
                }
            });

            log.info(`employee with email: ${email}, successfully verified OTP...`);
            res
                .status(HttpCode.OK)
                .json(ResponseMSG("Otp successfully verified"));
        } catch (error) {
            log.error("error occured when try to verified otp !")
            return exceptions.serverError(res, error);
        }
    },

    // Resend OTP to the employee
    resendOTP: async (req: Request, res: Response) => {
        try {
            const { email } = req.body as IResendOTP;
            if (!email) {
                log.warn("you have to enter email !");
                return exceptions.badRequest(res, "email is mandatory !");
            }
            log.info("email entrée pour le renvoi d'otp...");

            // check if employee exist
            const employee = await prisma.employee.findUnique({ 
                where: { 
                    email, 
                    deletedAt: null
                },
            });
            if (!employee) {
                log.warn(`employee not found: is it the email is correct ? Email: ${email}`);
                return exceptions.notFound(res, "employee not found !");
            }
            log.info("employee exist...");

            // Check if he was ever verified
            if (employee.verified === true) {
                log.warn("You have ever signin !")
                return exceptions.unauthorized(res, 'Your have ever sign in before!');
            }
            log.info("employee has not verified before...");

            const otp = generateSimpleOTP() || '';
            const now = new Date();
            const expireOTP = new Date(now.getTime() + envs.OTP_MAX_AGE)
            log.info("new OTP generated !")

            const newemployee = await prisma.employee.update({
                where: { 
                    email, 
                    deletedAt: null
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
                'Nouveau Code de connexion', // Subjet
                'otp', // Template
                { // Template Data
                    date: now,
                    name: newemployee.name,
                    otp: otp,
                }
            )
            log.info("otp send to employee...");

            // Return success message
            log.info(`employee with email: ${email}, received new OTP successfully...`);
            res
                .status(HttpCode.OK)
                .json(ResponseMSG("Otp successfully generate"))
        } catch (error) {
            log.error("error occured when try to resend employee otp !")
            return exceptions.serverError(res, error);
        }
    },

    clearAllEmployee: async (_req: Request, res: Response) => {
        try {
            const deleteResult = await prisma.employee.deleteMany({
                where: {
                    OR: [
                        { role: 'User' },
                        { role: 'Manager' }
                    ]
                }
            });

            const deletedCount = deleteResult.count;
            log.info(`Successfully deleted ${deletedCount} employees with role 'User' or 'Manager'.`)
           
            // Return success message
            log.info("All is ok, success !")
            res
                .status(HttpCode.CREATED)
                .json(ResponseMSG(`All employee Successfully Clear !`));
        } catch (error) {
            log.error("error occured when try clear employee !")
            return exceptions.serverError(res, error);
        }
    }
}
export default employeesControllers;