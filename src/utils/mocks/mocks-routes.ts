const ROUTES = {
    USER: {
        INSCRIPTION: '/signup',
        CONNEXION: '/login',
        DECONNEXION: '/logout',
        GET_USER: '/profile/:employeeID',
        GET_ALL_USER: '/profiles',
        UPDATE_USER: '/profile',
        DELETE_USER: '/profile/:employeeID',
        CHANGE_PASSSWORD: '/change-password',
        RESET_PASSSWORD: '/reset-password',
        VERIFY_OTP: '/verify-otp',
        RESEND_OTP: '/resend-otp',
    },
    
    ATTENDANCES: {
        CHECK_IN:  '/check-in',
        CHECK_OUT:  '/check-out',
        GET_ATTENANCES: '/:employeeID',
    },
    
    ABSCENCES: {
        GET_ABSCENCES: '/attendance/absences/:employeeID',
        GET_SALARY: '/salary/:employeeID',
        DISGRACE_EMPLOYEE: '/attendance/pardon/:employeeID'
    },

    CONFIG: {
        CSRF_TOKEN: '/csrf-token'
    }

}

export default  ROUTES;