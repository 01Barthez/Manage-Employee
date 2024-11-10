import attendanceControllers from "@src/controllers/attendance-controllers";
import authUser from "@src/middleware/authUser";
import roleUser from "@src/middleware/roleUser";
import { validate } from "@src/services/validator/validate";
import { validator } from "@src/services/validator/validator";
import ROUTES from "@src/utils/mocks/mocks-routes";
import { Router } from "express";

const attendance = Router();

attendance.post(
    ROUTES.ATTENDANCES.CHECK_IN,
    authUser,
    validator.DataCheckIN,
    validate,
    attendanceControllers.beginOfAttendance
);

attendance.post(
    ROUTES.ATTENDANCES.CHECK_OUT,
    authUser,
    validator.DataCheckOUT,
    validate,
    attendanceControllers.endOfAttendance
);

attendance.get(
    ROUTES.ATTENDANCES.GET_ATTENANCES,
    validator.DataAttendanceList,
    validate,
    attendanceControllers.consultAttendances
);

attendance.post(
    ROUTES.ATTENDANCES.CLEAR,
    authUser,
    roleUser('Admin'),
    attendanceControllers.clearAttendances
);

export default attendance;