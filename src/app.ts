import { envs } from './core/config/env';
import log from './core/config/logger';
import { app, httpsServer } from './server';

// Lancement du serveur
log.verbose("\n\n");
log.info("***************LANCEMENT DES SERVEURS***************\n");

// Lancement du serveur non sécurisé
app.listen(envs.PORT2, () => {
	log.info(`not server running on url: http://localhost:${envs.PORT2}/`);
	log.info(`Documentation: http://localhost:${envs.PORT2}/api-docs\n`);
});

// Lancement du serveur sécurisé
httpsServer.listen(envs.PORT, () => {
	log.info(`Server Secure running on url: https//localhost:${envs.PORT}/`);
	log.info(`Documentation : https://localhost:${envs.PORT}/api-docs\n\n`);
});