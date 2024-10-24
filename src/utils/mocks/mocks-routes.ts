const ROUTES = {
    USER: {
        // After the root user/
        INSCRIPTION: '/signup',
        CONNEXION: '/login',
        DECONNEXION: '/logout',
        GET_USER: '/profile/:userID',
        UPDATE_USER: '/profile',
        DELETE_USER: '/profile',
        RESEND_OTP: '/resend-otp',
        VERIFY_OTP: '/verify-otp',
        RESET_PASSSWORD: "/reset-password",
        CHANGE_PASSSWORD: "/profile/config"
    },
    
    OBJET: {
        // After the root item/
        CREATE_ONE_objet: '/',
        CREATE_MANY_objet: '/',
        GET_ONE_objet: '/:objetID',
        GET_MANY_objet: '/',
        UPDATE_objet: '/:objetID',
        DELETE_ONE_objet: '/:objetID',
        DELETE_MANY_objet: '/',
    },
    
    UPLOAD: {
        UPLOAD: '/upload',
    }
}

export default  ROUTES;