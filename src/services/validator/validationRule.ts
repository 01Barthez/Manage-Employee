import { body, query, ValidationChain } from "express-validator";
import { RoleUser } from "@prisma/client";
import {
    MAX_VALID_SALARY,
    MIN_VALID_SALARY,
    passwordRegex
} from "@src/core/constant";
import { envs } from "@src/core/config/env";


// Validation of user name
export const validateName: ValidationChain[] = [
    body('name')
        .exists().withMessage('name is required !')
        .trim()
        .isString().withMessage('name have to be a string !')
        .isLength({ min: 3 }).withMessage('name is too short; min: 3 !')
        .isLength({ max: 60 }).withMessage('name is too long: max: 60')
        .escape()
    ,
];

export const validateOptionalName: ValidationChain[] = [
    body('name')
        .optional()
        .trim().withMessage('name can not be empty !')
        .isString().withMessage('name have to be a string !')
        .isLength({ min: 3 }).withMessage('name is too short; min: 3 !')
        .isLength({ max: 60 }).withMessage('name is too long: max: 60')
        .escape()
    ,
];

// Validatoion of employee email
export const validateEmail: ValidationChain[] = [
    body('email')
        .exists().withMessage('email is required !')
        .isEmail().withMessage('invalid email address !')
        .escape()
    ,
];

export const validateOptionalEmail: ValidationChain[] = [
    body('email')
        .optional()
        .exists().withMessage('email is required !')
        .isEmail().withMessage('invalid email address !')
        .escape()
    ,
];


// validation of user password
export const validatePassword = (field: string = 'password'): ValidationChain[] => [
    body(field)
        .exists().withMessage(`${field} field is required.`)
        .trim()
        .notEmpty().withMessage(`${field} cannot be empty.`)
        .matches(passwordRegex).withMessage(`${field} is too weak; it must include uppercase, lowercase letters, and digits.`)
        .isLength({ min: 6 }).withMessage(`${field} must be at least 6 characters long.`)
    ,
];

// validation of user post
export const validatePost: ValidationChain[] = [
    body('post')
        .exists().withMessage('post is required !')
        .trim()
        .isString().withMessage('post should have a string !')
        .isLength({ min: 2 }).withMessage('post is too short: min: 2 !')
        .isLength({ max: 25 }).withMessage('post is too long !: max: 25')
        .escape()
    ,
];

export const validateOptionalPost: ValidationChain[] = [
    body('post')
        .optional()
        .trim().notEmpty().withMessage('post cannot be empty !')
        .isString().withMessage('post should have a string !')
        .isLength({ min: 2 }).withMessage('post is too short: min: 2 !')
        .isLength({ max: 25 }).withMessage('post is too long !: max: 25')
        .escape()
    ,
];

// Validation of user salary
export const validateSalary: ValidationChain[] = [
    body('salary')
        .exists().withMessage('salary is required !')
        .trim()
        .isInt({ min: MIN_VALID_SALARY, max: MAX_VALID_SALARY }).withMessage('invalid salary !')
        .escape()
    ,
];

export const validateOptionalSalary: ValidationChain[] = [
    body('salary')
        .optional()
        .trim().notEmpty().withMessage('salary cannot be empty !')
        .isInt({ min: MIN_VALID_SALARY, max: MAX_VALID_SALARY }).withMessage('invalid salary !')
        .escape()
    ,
];

// Validation of user Role
export const validateRole: ValidationChain[] = [
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
];

export const validatePage: ValidationChain[] = [
    query('page')
        .optional()
        .isInt({ min: 1, max: 200 }).withMessage('given page have to be a number')
        .isLength({ min: 1 }).withMessage('the page value is not correctly defined: min=1 !')
        .isLength({ max: 200 }).withMessage('the page value is too big !')
    ,
];

export const validateLimit: ValidationChain[] = [
    query('limit')
        .optional()
        .isInt().withMessage('given page have to be a number')
        .isLength({ min: 1 }).withMessage('the limit value is not correctly defined: min=1 !')
        .isLength({ max: envs.MAX_LIMIT_DATA }).withMessage('the limit value is too big !')
    ,
]