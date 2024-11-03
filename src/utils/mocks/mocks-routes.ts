const ROUTES = {
    USER: {
        // After the root user/
        INSCRIPTION: '/signup',
        CONNEXION: '/login',
        DECONNEXION: '/logout',
        GET_USER: '/profile/:employeeID',
        GET_ALL_USER: '/profiles',
        UPDATE_USER: '/profile',
        DELETE_USER: '/profile',
        RESEND_OTP: '/resend-otp',
        VERIFY_OTP: '/verify-otp',
        RESET_PASSSWORD: "/reset-password",
        CHANGE_PASSSWORD: "/profile/config"
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