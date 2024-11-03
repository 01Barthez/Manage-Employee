import attendanceControllers from "@src/controllers/attendance-controllers";
import authUser from "@src/middleware/authUser";
import ROUTES from "@src/utils/mocks/mocks-routes";
import { Router } from "express";

const attendance = Router();

attendance.post(
    ROUTES.ATTENDANCES.CHECK_IN,
    authUser,
    attendanceControllers.beginOfAttendance
);

attendance.post(
    ROUTES.ATTENDANCES.CHECK_OUT,
    authUser,
    attendanceControllers.endOfAttendance
);

attendance.get(
    ROUTES.ATTENDANCES.GET_ATTENANCES,
    attendanceControllers.consultAttendances
);

export default attendance;