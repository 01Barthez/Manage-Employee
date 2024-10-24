import { envs } from './core/config/env';
import log from './core/config/logger';
import app from './server';

// Lancement du serveur
app.listen(envs.PORT, () => {
	log.info(`Server running on port http://localhost:${envs.PORT}/`);
	log.info(`Documentation  : http://localhost:${envs.PORT}/api-docs`);
});


