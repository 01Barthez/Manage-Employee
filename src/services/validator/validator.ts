import { RoleUser } from "@prisma/client";
import { envs } from "@src/core/config/env";
import { MAX_VALID_SALARY, MIN_VALID_SALARY, passwordRegex } from "@src/core/constant";
import { body, query } from "express-validator";

export const validator = {
    DataInscription: [
        body('name')
            .exists().withMessage('name is required !')
            .trim()
            .isString().withMessage('name have to be a string !')
            .isLength({ min: 3 }).withMessage('name is too short; min: 3 !')
            .isLength({ max: 60 }).withMessage('name is too long: max: 60')
            .escape()
        ,

        body('email')
            .exists().withMessage('email is required !')
            .isEmail().withMessage('invalid email address !')
            .escape()
        ,

        body('password')
            .exists().withMessage(`password field is required.`)
            .trim()
            .notEmpty().withMessage(`password cannot be empty.`)
            .matches(passwordRegex).withMessage(`password is too weak; it must include uppercase, lowercase letters, and digits.`)
            .isLength({ min: 6 }).withMessage(`password must be at least 6 characters long.`)
        ,

        body('post')
            .exists().withMessage('post is required !')
            .trim()
            .isString().withMessage('post should have a string !')
            .isLength({ min: 2 }).withMessage('post is too short: min: 2 !')
            .isLength({ max: 25 }).withMessage('post is too long !: max: 25')
            .escape()
        ,

        body('salary')
            .exists().withMessage('salary is required !')
            .trim()
            .isInt({ min: MIN_VALID_SALARY, max: MAX_VALID_SALARY }).withMessage('invalid salary !')
            .escape()
        ,

        body('role')
            .optional()
            .isString().withMessage('role should have a string !')
            .isLength({ min: 3 }).withMessage('role is too short !')
            .isLength({ max: 50 }).withMessage('role is too long !')
            .escape()
            .custom(val => {
                if (val && !Object.values(RoleUser).includes(val))
                    throw new Error('Undefined given role');
                return true;
            })
        ,
    ],

    DataConnexion: [
        body('email')
            .exists().withMessage('email is required !')
            .isEmail().withMessage('invalid email address !')
            .escape()
        ,

        body('password')
            .exists().withMessage(`password field is required.`)
            .trim()
            .notEmpty().withMessage(`password cannot be empty.`)
            .matches(passwordRegex).withMessage(`password is too weak; it must include uppercase, lowercase letters, and digits.`)
            .isLength({ min: 6 }).withMessage(`password must be at least 6 characters long.`)
        ,
    ],

    DataUpdateEmployee: [
        body('name')
            .optional()
            .trim()
            .isString().withMessage('name have to be a string !')
            .isLength({ min: 3 }).withMessage('name is too short; min: 3 !')
            .isLength({ max: 60 }).withMessage('name is too long: max: 60')
            .escape()
        ,

        body('email')
            .optional()
            .exists().withMessage('email is required !')
            .isEmail().withMessage('invalid email address !')
            .escape()
        ,

        body('post')
            .optional()
            .trim()
            .isString().withMessage('post should have a string !')
            .isLength({ min: 2 }).withMessage('post is too short: min: 2 !')
            .isLength({ max: 25 }).withMessage('post is too long !: max: 25')
            .escape()
        ,

        body('salary')
            .optional()
            .trim()
            .notEmpty().withMessage('salary cannot be empty !')
            .isInt({ min: MIN_VALID_SALARY, max: MAX_VALID_SALARY }).withMessage('invalid salary !')
            .escape()
        ,

        body('role')
            .optional()
            .isString().withMessage('role should have a string !')
            .isLength({ min: 3 }).withMessage('role is too short !')
            .isLength({ max: 50 }).withMessage('role is too long !')
            .escape()
            .custom(val => {
                if (val && !Object.values(RoleUser).includes(val))
                    throw new Error('Undefined given role');
                return true;
            })
        ,
    ],

    DataPagination: [
        query('page')
            .optional()
            .isInt({ min: 1, max: 200 }).withMessage('given page have to be a number')
            .isLength({ min: 1 }).withMessage('the page value is not correctly defined: min=1 !')
            .isLength({ max: 200 }).withMessage('the page value is too big !')
        ,

        query('limit')
            .optional()
            .isInt().withMessage('given page have to be a number')
            .isLength({ min: 1 }).withMessage('the limit value is not correctly defined: min=1 !')
            .isLength({ max: envs.MAX_LIMIT_DATA }).withMessage('the limit value is too big !')
        ,
    ],


    DataChangePassword: [
        body('oldPassword')
            .exists().withMessage(`oldPassword field is required.`)
            .trim()
            .notEmpty().withMessage(`oldPassword cannot be empty.`)
            .matches(passwordRegex).withMessage(`oldPassword is too weak; it must include uppercase, lowercase letters, and digits.`)
            .isLength({ min: 6 }).withMessage(`oldPassword must be at least 6 characters long.`)
        ,

        body('newPassword')
            .exists().withMessage(`newPassword field is required.`)
            .trim()
            .notEmpty().withMessage(`newPassword cannot be empty.`)
            .matches(passwordRegex).withMessage(`newPassword is too weak; it must include uppercase, lowercase letters, and digits.`)
            .isLength({ min: 6 }).withMessage(`newPassword must be at least 6 characters long.`)
        ,
    ],

    DataResetPassword: [
        body('email')
            .exists().withMessage('email is required !')
            .isEmail().withMessage('invalid email address !')
            .escape()
        ,

        body('newpassword')
            .exists().withMessage(`newpassword field is required.`)
            .trim()
            .notEmpty().withMessage(`newpassword cannot be empty.`)
            .matches(passwordRegex).withMessage(`newpassword is too weak; it must include uppercase, lowercase letters, and digits.`)
            .isLength({ min: 6 }).withMessage(`newpassword must be at least 6 characters long.`)
        ,
    ]
    ,

    DataOTP: [
        body('email')
            .exists().withMessage('email is required !')
            .isEmail().withMessage('invalid email address !')
            .escape()
        ,

        body("otp")
            .exists().withMessage("OTP dode is required")
            .isLength({ min: 6, max: 6 }).withMessage("OTP code should have 6 caracters")
            .escape(),
    ],

    DataEmail: [
        body('email')
            .exists().withMessage('email is required !')
            .isEmail().withMessage('invalid email address !')
            .escape()
        ,
    ],

    DataCheckIN: [
        body('reason')
            .optional()
            .trim()
            .isString().withMessage('reason have to be a string !')
            .isLength({ min: 10 }).withMessage('reason is too short; min: 10 !')
            .isLength({ max: 200 }).withMessage('reason is too long: max: 200')
            .escape()
        ,
    ],

    DataCheckOUT: [
        body('message')
            .exists().withMessage('message is required !')
            .trim().withMessage('message can not be empty !')
            .isString().withMessage('message have to be a string !')
            .isLength({ min: 10 }).withMessage('message is too short; min: 10 !')
            .isLength({ max: 1000 }).withMessage('message is too long: max: 1000')
            .escape()
        ,
    ],

    DataAttendanceList: [
        query('day')
            .optional()
            .isInt({ min: 1, max: 31 })
            .withMessage('Enter a valid month number (between 1 and 31)')
        ,

        query('month')
            .optional()
            .isInt({ min: 1, max: 12 })
            .withMessage('Enter a valid month number (between 1 and 12)')
        ,

        query('year')
            .optional()
            .isInt({ min: 2000, max: new Date().getFullYear() })
            .withMessage(`Enter a valid year between 2000 and 2024 !`)
        ,

        query('page')
            .optional()
            .isInt({ min: 1, max: 200 }).withMessage('given page have to be a number')
            .isLength({ min: 1 }).withMessage('the page value is not correctly defined: min=1 !')
            .isLength({ max: 200 }).withMessage('the page value is too big !')
        ,

        query('limit')
            .optional()
            .isInt().withMessage('given page have to be a number')
            .isLength({ min: 1 }).withMessage('the limit value is not correctly defined: min=1 !')
            .isLength({ max: envs.MAX_LIMIT_DATA }).withMessage('the limit value is too big !')
        ,
    ],

    DataBonus: [
        body('description')
            .exists().withMessage('description is required !')
            .trim().withMessage('description can not be empty !')
            .isString().withMessage('description have to be a string !')
            .isLength({ min: 10 }).withMessage('description is too short; min: 10 !')
            .isLength({ max: 1000 }).withMessage('description is too long: max: 1000')
            .escape()
        ,

        body('amount')
            .exists().withMessage('amount is required !')
            .isInt({ min: 50, max: 5000000 })
            .withMessage('Enter a valid amount')
        ,
    ]
}
