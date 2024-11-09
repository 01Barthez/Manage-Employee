const ROUTES = {
    USER: {
        INSCRIPTION: '/signup',
        CONNEXION: '/login',
        DECONNEXION: '/logout',
        GET_USER: '/profile/:employeeID',
        GET_ALL_USER: '/profiles',
        GET_ALL_DELETED: 'config/profiles',
        UPDATE_USER: '/profile',
        DELETE_USER: '/profile/:employeeID',
        CLEAR_USER: '/config/profiles',
        CHANGE_PASSSWORD: '/change-password',
        RESET_PASSSWORD: '/reset-password',
        VERIFY_OTP: '/verify-otp',
        RESEND_OTP: '/resend-otp',
        CLEAR: '/clear',
    },
    
    ATTENDANCES: {
        CHECK_IN:  '/check-in',
        CHECK_OUT:  '/check-out',
        GET_ATTENANCES: '/:employeeID',
        CLEAR: '/clear',
    },
    
    ABSCENCES: {
        GET_ABSCENCES: '/attendance/absences/:employeeID',
        GET_SALARY: '/salary/:employeeID',
        DISGRACE_EMPLOYEE: '/attendance/pardon/:employeeID',
        CLEAR: '/clear',
    },

    BONUS: {
        ADD_BONUS: '/bonus/new/:employeeID',
        GET_BONUS: '/bonus/:employeeID',
        CLEAR: '/bonus/clear',
    },

    ACHIEVMENTS: {
        GET_ACHIEVMENTS: '/achievment/:employeeID',
        CLEAR: '/achievment/clear',
    },

    CONFIG: {
        UPDATE: '/config/update',
        CSRF_TOKEN: '/csrf-token'
    }

}

export default  ROUTES;