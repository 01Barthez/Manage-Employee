import rateLimit from "express-rate-limit";
import csurf from 'csurf'
import { LIMIT_REQUEST } from "@src/utils/mocks/mocks-message";
import keys from "@src/core/config/key";
import log from "@src/core/config/logger";
import { envs } from "@src/core/config/env";

// Configurer la politique CSP
export const cspOptions = {
    directives: {
        defaultSrc: ["'self'"], // Permet uniquement les ressources provenant du même domaine
        scriptSrc: ["'self'"], // Permet les scripts de votre domaine, et les inline (à utiliser avec précaution)
        styleSrc: ["'self'", "'nonce'"], // Permet les styles de votre domaine, et les inline
        imgSrc: ["'self'", "data:"], // Permet les images venant de votre domaine et de sources inline
        connectSrc: ["'self'"], // Permet uniquement les connexions au même domaine
        fontSrc: ["'self'"], // Permet uniquement les polices de votre domaine
        objectSrc: ["'none'"], // Bloque les objets (pour prévenir les attaques par plugins)
        upgradeInsecureRequests: [], // Force l'utilisation de HTTPS pour toutes les requêtes
        blockAllMixedContent: [], // Bloque tous les contenus mixtes (HTTP dans une page HTTPS)
    },
    reportOnly: true, // Pour initialement tester sans bloquer
};

export const hstsOption = {
	maxAge: envs.HSTS_MAX_AGE,
	includeSubDomains: true,
	preload: true,
};

export const csrfProtection = csurf({
    cookie: {
        secure: envs.JWT_COOKIE_SECURITY,
        httpOnly: envs.JWT_COOKIE_HTTP_STATUS,
        sameSite: "strict"
    }
})

const CorsMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
export const corsOptions = {
	methods: CorsMethods,
	credentials: true,
};

export const rateLimiting = rateLimit({
    max: envs.MAX_GLOBAL_QUERY_NUMBER,
    windowMs: envs.MAX_GLOBAL_QUERY_WINDOW,
    message: LIMIT_REQUEST.GLOBAL_ROUTE
})

export const rateLimitingSubRoute = rateLimit({
    max: envs.MAX_UNIQ_QUERY_NUMBER,
    windowMs: envs.MAX_UNIQ_QUERY_WINDOW,
    message: LIMIT_REQUEST.SUB_ROUTE
})

export const credentials = {
	key: keys.tls.privateKey,
	cert: keys.tls.certificate
}

export const morganFormat = ':method :url  :status :response-time ms' 
export const morganOptions = {
	stream: {
        // Redirige les logs HTTP vers Winston
		write: (message) => log.http(message.trim())
	}
}
