import usersControllers from '@src/controllers/users-controllers';
import authUser from '@src/middleware/authUser';
import roleEmployee from '@src/middleware/roleUser';
// import upload from "@src/middleware/upload-file";
import { validate, validator } from '@src/services/validator/validator';
import ROUTES from '@src/utils/mocks/mocks-routes';
import { Router } from 'express';
import { RoleUser } from "../core/interfaces/interfaces";

const employee: Router = Router();

//? Inscription of new employee

employee.post(
    ROUTES.USER.INSCRIPTION,
    validator.validateEmployee,
    validate,
    // upload.single('profile'),
    usersControllers.inscription
);

//? Connexion of user

employee.post(
    ROUTES.USER.CONNEXION,
    validator.validateEmail,
    validate,
    usersControllers.connexion
);

//? Deconnexion of user
employee.post(
    ROUTES.USER.DECONNEXION,
    authUser,
    usersControllers.deconnexion
);

//? consultation of all users
employee.get(
    ROUTES.USER.GET_USER,
    usersControllers.consulteEmployee
);

//? consultation of all employees
employee.get(
    ROUTES.USER.GET_ALL_USER,
    usersControllers.consulteAllEmployees
);

//? update user
employee.put(
    ROUTES.USER.UPDATE_USER,
    authUser,
    // validator.validateUser,
    // validate,
    // upload.single('image'),
    usersControllers.updateEmployeeData
);

//? Delete user
employee.delete(
    ROUTES.USER.DELETE_USER,
    authUser,
    roleEmployee(RoleUser.admin),
    usersControllers.deleteEmployee
);

//? changepassword
employee.put(
    ROUTES.USER.CHANGE_PASSSWORD,
    authUser,
    validator.validatePWDs,
    validate,
    usersControllers.changePassword
);

//? reset password
employee.put(
    ROUTES.USER.RESET_PASSSWORD,
    validator.validatenewPWD,
    validate,
    usersControllers.resetPassword
);

//? verifyOTP
employee.put(
    ROUTES.USER.VERIFY_OTP,
    validator.validateOTP,
    validate,
    usersControllers.verifyOtp
);

//? resendOTP
employee.get(
    ROUTES.USER.RESEND_OTP,
    validator.validateEmployeeEmail,
    validate,
    usersControllers.resendOTP
);

export default employee;
