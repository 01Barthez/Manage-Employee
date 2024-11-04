import usersControllers from '@src/controllers/users-controllers';
import authUser from '@src/middleware/authUser';
// import upload from "@src/middleware/upload-file";
import { validate, validator } from '@src/services/validator/validator';
import ROUTES from '@src/utils/mocks/mocks-routes';
import { Router } from 'express';

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
    validator.validateUserUpdate,
    validate,
    // upload.single('image'),
    usersControllers.updateEmployeeData
);

//? Delete user
employee.delete(
    ROUTES.USER.DELETE_USER,
    authUser,
    usersControllers.deleteEmployee
);

//? changepassword
employee.post(
    ROUTES.USER.CHANGE_PASSSWORD,
    authUser,
    validator.validatePWDs,
    validate,
    usersControllers.changePassword
);

//? reset password
employee.post(
    ROUTES.USER.RESET_PASSSWORD,
    validator.validatenewPWD,
    validate,
    usersControllers.resetPassword
);

//? verifyOTP
employee.post(
    ROUTES.USER.VERIFY_OTP,
    validator.validateOTP,
    validate,
    usersControllers.verifyOtp
);

//? resendOTP
employee.post(
    ROUTES.USER.RESEND_OTP,
    validator.validateEmployeeEmail,
    validate,
    usersControllers.resendOTP
);

export default employee;
