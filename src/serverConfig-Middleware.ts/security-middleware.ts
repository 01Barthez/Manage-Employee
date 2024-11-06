
import { Express } from 'express';
import helmet from 'helmet';
import {
    cspOptions,
    hstsOption,
    // csrfProtection 
} from './securityConfig';
import csrfErrorHandler from '@src/middleware/csrfErrorHandler';



const setupSecurity = (app: Express) => {
    //? Utilisation de Helmet Pour configurer les entete http securisées
    app.use(helmet()); // Activé toutes les protections par défaut de helmet...
    app.use(helmet.hsts(hstsOption)) // Configuration HSTS (HTTP Strict Transport Security) 
    app.use(helmet.contentSecurityPolicy(cspOptions)); // Applique la politique CSP à toutes les requêtes

    //? configuerer les vérifications CSRF
    // app.use(csrfProtection); // sécurisé toutes les routes avec CSRF
    app.use(csrfErrorHandler); // Middleware pour gérer les erreurs CSRF

}

export default setupSecurity