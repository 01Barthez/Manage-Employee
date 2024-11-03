const ROUTES = {
    // After the root employee
    USER: {
        INSCRIPTION: '/signup',
        CONNEXION: '/login',
        DECONNEXION: '/logout',
        GET_USER: '/profile/:employeeID',
        GET_ALL_USER: '/profiles',
        UPDATE_USER: '/profile',
        DELETE_USER: '/profile/:employeeID',
        CHANGE_PASSSWORD: "/change-password",
        RESET_PASSSWORD: "/reset-password",
        VERIFY_OTP: '/verify-otp',
        RESEND_OTP: '/resend-otp',
    },
    
    ATTENDANCES: {
        // After the root item/
        CHECK_IN:  '/check-in',
        CHECK_OUT:  '/check-out',
        GET_ATTENANCES: '/',
    },
    
    ABSCENCES: {
        GET_ABSCENCES: '/attendance/absences',
        GET_SALARY: '/salary'
    }
}

export default  ROUTES;