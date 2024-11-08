
import compression from 'compression';
import { Express } from 'express';
import morgan from 'morgan';
import { morganFormat, morganOptions } from './securityConfig';

const setupLogging = (app: Express): void => {
    //? compression des requetes http
    app.use(compression());

    //? Middleware de journalisation avec Morgan qui utilise Winston
    app.use(morgan(morganFormat, morganOptions));
}

export default setupLogging