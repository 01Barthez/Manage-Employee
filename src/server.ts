import express from 'express';
import https from 'https';
import initMiddlewares from './serverConfig-Middleware.ts/initMiddlewares';
import startJobs from './services/jobs/allJob';
import { setupSwagger } from './swagger';
import { credentials } from './serverConfig-Middleware.ts/securityConfig';

const app = express();

//* Initialiser les Middlewares de l'application
initMiddlewares(app)

//* Start All the jobs here
startJobs()

//* Documentation
setupSwagger(app);

//* Creation du server https
const httpsServer = https.createServer(credentials, app);

export { app, httpsServer };
