// Fichier de configuration pour la doc
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { Express } from 'express';
import { envs } from './core/config/env';

const swaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'Worketyamo Employee Management',
		version: '1.0.0',
		description: '🌟 WorketYamo Employee Management System est une solution complète de gestion des ressources humaines conçue pour moderniser et optimiser les processus RH des entreprises de toutes tailles. Ce systeme est conçu pour optimiser le suivi des présences, la gestion des absences et le calcul des salaires en fonctions des abscences. Ce système automatisé et sécurisé aideras donc à améliorer la productivité et à réduire les coûts liés aux absences non justifiées.\nIci Sont exposé toutes les routes de l\'application',
		contact: {
			name: "Barthez Kenwou",
		}
	},
	servers: [
		{
			url: `https://localhost:${envs.PORT}`,
		},
		{
			url2: `http://localhost:${envs.PORT2}`
		}
	]
};

const options = {
	swaggerDefinition,
	apis: ['./src/routes/*.ts'] // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
