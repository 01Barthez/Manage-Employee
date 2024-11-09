import { body, query } from "express-validator";
import {
    validateEmail,
    validateLimit,
    validateName,
    validateOptionalEmail,
    validateOptionalName,
    validateOptionalPost,
    validateOptionalSalary,
    validatePage,
    validatePassword,
    validatePost,
    validateRole,
    validateSalary
} from "./validationRule";

export const validator = {
    DataInscription: [
        ...validateName,
        ...validateEmail,
        ...validatePassword(),
        ...validatePost,
        ...validateSalary,
        ...validateRole
    ],

    DataConnexion: [
        ...validateEmail,
        ...validatePassword(),
    ],

    DataUpdateEmployee: [
        ...validateOptionalName,
        ...validateOptionalEmail,
        ...validateOptionalPost,
        ...validateOptionalSalary,
        ...validateRole
    ],

    DataPagination: [
        ...validatePage,
        ...validateLimit,
    ],


    DataChangePassword: [
        ...validatePassword('oldPassword'),
        ...validatePassword('newPassword'),
    ],

    DataResetPassword: [
        ...validateEmail,
        ...validatePassword('newpassword'),
    ],

    DataOTP: [
        ...validateEmail,

        // validate user otp
        body("otp")
            .exists().withMessage("OTP dode is required")
            .isLength({ min: 6, max: 6 }).withMessage("OTP code should have 6 caracters")
            .escape(),
    ],

    DataEmail: [
        ...validateEmail,
    ],

    DataCheckIN: [
        body('reason')
            .optional()
            .trim().withMessage('reason can not be empty !')
            .isString().withMessage('reason have to be a string !')
            .isLength({ min: 10 }).withMessage('reason is too short; min: 10 !')
            .isLength({ max: 200 }).withMessage('reason is too long: max: 200')
            .escape()
    ],

    DataCheckOUT: [
        body('accomplissement')
            .exists().withMessage('accomplishment is required !')
            .trim().withMessage('accomplissement can not be empty !')
            .isString().withMessage('accomplissement have to be a string !')
            .isLength({ min: 10 }).withMessage('accomplissement is too short; min: 10 !')
            .isLength({ max: 1000 }).withMessage('accomplissement is too long: max: 1000')
            .escape()
    ],

    DataAttendanceList: [
        query('day')
            .optional()
            .isInt({ min: 1, max: 31 })
            .withMessage('Enter a valid month number (between 1 and 31)'),

        query('month')
            .optional()
            .isInt({ min: 1, max: 12 })
            .withMessage('Enter a valid month number (between 1 and 12)'),

        query('year')
            .optional()
            .isInt({ min: 2000, max: new Date().getFullYear() })
            .withMessage(`Enter a valid year between 2000 and 2024 !`),

        ...validatePage,

        ...validateLimit,
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
