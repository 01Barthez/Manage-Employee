import employeesControllers from "@src/controllers/employee-controllers";
import authUser from "@src/middleware/authUser";
import roleUser from "@src/middleware/roleUser";
import handleMulterErrors from "@src/services/upload/handleEror";
import uploadImage from "@src/services/upload/upload-file";
import { validate } from "@src/services/validator/validate";
import { validator } from "@src/services/validator/validator";
import ROUTES from "@src/utils/mocks/mocks-routes";
import { Router } from "express";


const employee: Router = Router();

//? Inscription of new employee
employee.post(
    ROUTES.USER.INSCRIPTION,
    uploadImage.single('profile'),
    handleMulterErrors,
    validator.DataInscription,
    validate,
    employeesControllers.inscription
);

//? Connexion of user 
employee.post(
    ROUTES.USER.CONNEXION,
    validator.DataConnexion,
    validate,
    employeesControllers.connexion
);

//? Deconnexion of user
employee.post(
    ROUTES.USER.DECONNEXION,
    authUser,
    employeesControllers.deconnexion
);

//? consultation of all users
employee.get(
    ROUTES.USER.GET_USER,
    employeesControllers.consultEmployee
);

//? consultation of all employees
employee.get(
    ROUTES.USER.GET_ALL_USER,
    validator.DataPagination,
    validate,
    employeesControllers.consultAllEmployees
);

//? consultation of all employees
employee.get(
    ROUTES.USER.GET_ALL_DELETED,
    validator.DataPagination,
    validate,
    employeesControllers.consultAllDeletedEmployees
);

//? update user
employee.put(
    ROUTES.USER.UPDATE_USER,
    authUser,
    uploadImage.single('profile'),
    handleMulterErrors,
    validator.DataUpdateEmployee,
    validate,
    employeesControllers.updatEmployeeData
);

//? Delete user
employee.delete(
    ROUTES.USER.DELETE_USER,
    authUser,
    employeesControllers.deleteEmployee
);

//? clear deleted employee
employee.delete(
    ROUTES.USER.CLEAR_USER,
    authUser,
    roleUser("Admin"),
    employeesControllers.clearDeletedEmployee
);

//? changepassword
employee.post(
    ROUTES.USER.CHANGE_PASSSWORD,
    authUser,
    validator.DataChangePassword,
    validate,
    employeesControllers.changePassword
);

//? reset password
employee.post(
    ROUTES.USER.RESET_PASSSWORD,
    validator.DataResetPassword,
    validate,
    employeesControllers.resetPassword
);

//? verifyOTP
employee.post(
    ROUTES.USER.VERIFY_OTP,
    validator.DataOTP,
    validate,
    employeesControllers.verifyOtp
);

//? resendOTP
employee.post(
    ROUTES.USER.RESEND_OTP,
    validator.DataEmail,
    validate,
    employeesControllers.resendOTP
);

//? resendOTP
employee.post(
    ROUTES.USER.CLEAR,
    authUser,
    roleUser("Admin"),
    employeesControllers.clearAllEmployee
);

export default employee;
