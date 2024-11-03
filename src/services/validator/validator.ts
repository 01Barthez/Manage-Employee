import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { HttpCode } from "../../core/constant";

// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
export const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

export const validator = {
    validateEmployee: [
        // Validation of user name
        body('name')
            .exists().withMessage('Le nom de l\'employee est requis !')
            .trim().notEmpty().withMessage('le nom ne doit pas etre vide !')
            .isString().withMessage('le nom doit etre une chaine de caractere !')
            .isLength({ min: 3 }).withMessage('le nom est trop court !')
            .isLength({ max: 60 }).withMessage('le nom est trop long !')
            .escape()
        ,

        // Validatoion of user email
        body('email')
            .exists().withMessage('L\'email est requis !')
            .trim().notEmpty().withMessage('l\'email ne doit pas etre vide !')
            .isEmail().withMessage('Addresse email invailde !')
            .escape()
        ,

        // validation of user password
        body('password')
            .exists().withMessage('Le mot de passe est requis !')
            .trim().notEmpty().withMessage('mot de passe ne peut etre vide!')
            .matches(passwordRegex).withMessage('mot de passe trop faible !')
        ,

        body('post')
            .exists().withMessage('post is required !')
            .trim().notEmpty().withMessage('post cannot be empty !')
            .isString().withMessage('post should have a string !')
            .isLength({ min: 2 }).withMessage('post is too short !')
            .isLength({ max: 25 }).withMessage('post is too long !')
            .escape()
        ,

        body('salary')
            .exists().withMessage('salary is required !')
            .trim().notEmpty().withMessage('salary cannot be empty !')
            .isInt({ min: 1000, max: 100000000 }).withMessage('invalid salary !')
            .escape()
        ,

        body('role')
            .optional()
            .isString().withMessage('role should have a string !')
            .isLength({ min: 3 }).withMessage('role is too short !')
            .isLength({ max: 50 }).withMessage('role is too long !')
            .escape()
    ],

    validateEmail: [
        // Validatoion of user email
        body('email')
            .exists().withMessage('L\'email est requis !')
            .isEmail().withMessage('Addresse email invailde !')
            .escape()
        ,
        // validation of user password
        body('password')
            .exists().withMessage('Veillez entrer un mot de passe !').escape()
        ,
    ],

    validateEmployeeEmail: [
        // Validatoion of user email
        body('email')
            .exists().withMessage('L\'email est requis !')
            .isEmail().withMessage('Addresse email invailde !')
            .escape()
        ,
    ],

    validateUserUpdate: [
        // Validation of user name
        body('name')
            .optional()
            .isString().withMessage('le nom doit etre une chaine de caractere !')
            .isLength({ min: 3 }).withMessage('le nom est trop court !')
            .isLength({ max: 50 }).withMessage('le nom est trop long !')
        ,
        // Validatoion of user email
        body('email')
            .optional()
            .isEmail().withMessage('Addresse email invailde !')
            .escape()
        ,

        body('post')
            .optional()
            .isString().withMessage('post should have a string !')
            .isLength({ min: 2 }).withMessage('post is too short !')
            .isLength({ max: 25 }).withMessage('post is too long !')
            .escape()
        ,

        body('salary')
            .optional()
            .isInt({ min: 1000, max: 100000000 }).withMessage('invalid salary !')
            .escape()
        ,

        body('role')
            .optional()
            .isString().withMessage('role should have a string !')
            .isLength({ min: 3 }).withMessage('role is too short !')
            .isLength({ max: 50 }).withMessage('role is too long !')
            .escape()
    ],

    validatenewPWD: [
        // Validatoion of user email
        body('email')
            .exists().withMessage('L\'email est requis !')
            .isEmail().withMessage('Addresse email invailde !')
            .escape()
        ,

        // validation of user password
        body('newpassword')
            .exists().withMessage('Le mot de passe est requis !')
            .matches(passwordRegex).withMessage('mot de passe trop faible !')
        ,
    ],

    validatePWDs: [
        // validation of user password
        body('oldPassword')
            .exists().withMessage('Le mot de passe est requis !')
            .matches(passwordRegex).withMessage('mot de passe trop faible !')
        ,

        // validation of user password
        body('newPassword')
            .exists().withMessage('Le mot de passe est requis !')
            .matches(passwordRegex).withMessage('mot de passe trop faible !')
        ,

    ],

    validateOTP: [
        // Validatoion of user email
        body('email')
            .exists().withMessage('L\'email est requis !')
            .isEmail().withMessage('Addresse email invailde !')
            .escape()
        ,

        // Validation de l'otp
        body("otp")
            .exists().withMessage("Code OTP requis")
            .isLength({ min: 6, max: 6 }).withMessage("le code otp doit avoir 6 caracteres")
            .escape(),
    ],
}

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res
            .status(HttpCode.UNPROCESSABLE_ENTITY)
            .json(
                {
                    errors: errors.array()
                }
            )
    }
    next();
}
