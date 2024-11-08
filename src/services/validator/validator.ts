import { body, query } from "express-validator";
import { envs } from "@src/core/config/env";
import {
    validateEmail,
    validateName,
    validateOptionalEmail,
    validateOptionalName,
    validateOptionalPost,
    validateOptionalSalary,
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

    Dataemail: [
        ...validateEmail,
    ]
}
