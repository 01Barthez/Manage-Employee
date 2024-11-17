import { setupSwagger } from './swagger';
import express from 'express';
import https from 'https';
import startJobs from './services/jobs/allJob';
import { credentials } from './services/serverConfig-Middleware.ts/securityConfig';
import initMiddlewares from './services/serverConfig-Middleware.ts/initMiddlewares';
import './services/servicesConfig/loadData';

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
