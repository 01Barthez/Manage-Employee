import { Express } from 'express';
import { rateLimitingSubRoute } from './securityConfig';
import attendance from '@src/routes/attendances-route';
import abscence from '@src/routes/abscences-route';
import config from '@src/routes/config-routes';
import employee from '@src/routes/users-route';
import bonus from '@src/routes/achievments-route';
import achievment from '@src/routes/achievments-route';



//? program routes
const setupRoutes = (app: Express): void => {
    app.use(
        "/employees",
        rateLimitingSubRoute,
        employee
    );
    app.use(
        "/attendance",
        rateLimitingSubRoute,
        attendance
    );
    app.use(
        '/',
        rateLimitingSubRoute,
        abscence
    );
    app.use(
        '/',
        rateLimitingSubRoute,
        bonus
    );
    app.use(
        '/',
        rateLimitingSubRoute,
        achievment
    );
    app.use(
        '/config',
        rateLimitingSubRoute,
        config
    );
}

export default setupRoutes