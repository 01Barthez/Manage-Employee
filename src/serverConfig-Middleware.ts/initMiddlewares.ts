import express, { Express } from 'express';
import setupSecurity from './security-middleware';
import { corsOptions, rateLimiting } from './securityConfig';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import redirectURL from '@src/middleware/redirectUrl';
import disableLogsInProduction from '@src/middleware/disableLog';
import setupRoutes from './routes-middleware';
import setupLogging from './logging-middleware';


const initMiddlewares = (app: Express): void => {
    //? Initialiser les middleware de sécurité de l'application
    setupSecurity(app);

    //? gérer le partage des ressources de maniere securisée
    app.use(cors(corsOptions))

    //? parser les requetes json
    app.use(express.json());

    
    //? parser les requetes url encoder
    app.use(express.urlencoded({ extended: true }));

    //? Analyse des cookies
    app.use(cookieParser());

    //? limite le nombre de requete sur l'application
    app.use(rateLimiting);

    //? Redirect unsecure URL: Move HTTP to HTTPS
    app.use(redirectURL);

    //? Reduce fingerprinting
    app.disable('x-powered-by')

    //? Initialiser les middleware de gestions de logs (morgan+winston)
    setupLogging(app);

    //? Initialiser les middleware d'appels de routes
    setupRoutes(app);
    
    //? Desactiver les logs de console en production
    app.use(disableLogsInProduction);
}

export default initMiddlewares
