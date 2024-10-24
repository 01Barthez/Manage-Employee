import winston, { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { envs } from './env';

const { colorize, align } = winston.format;

// Fonction de configuration pour la rotation quotidienne des fichiers de logs
const createTransport = (filename: string, level: string, maxFiles: number) => {
    return new DailyRotateFile({
        filename: `logs/${filename}-%DATE%.log`, // Nom du fichier basé sur le niveau
        datePattern: 'YYYY-MM-DD', // Format de la date
        zippedArchive: true, // Archiver les anciens fichiers en zip
        maxSize: '30m', // Taille maximale du fichier de log
        maxFiles: `${maxFiles}d`, // Nombre maximum de jours à conserver
        level // Niveau de log (si spécifié)
    });
};

// Definir le niveau de log en fonction de l'environement... Ceci pour filtrer certains log et ne pas les envoyer en production 
const logLevel = envs.NODE_ENV === 'production' ? 'info' : 'debug';

// Transporteur pour les log généraux
const transport = createTransport('application', 'info', 14);

// Transporteur pour les log de warn
const warnTransport = createTransport('warns', 'warn', 21);

// Transporteur pour les log de debug
const debugTransport = createTransport('debugs', 'debug', 21);

// Transporteur pour les log d'erreur
const errorTransport = createTransport('errors', 'error', 30);

/**
 * Crée un logger Winston configuré pour enregistrer les logs dans des fichiers avec rotation quotidienne.
 * Gère à la fois les logs généraux, les logs de warning et les logs d'erreurs.
 * Les exceptions non capturées et les promesses rejetées sont également traitées.
 */
const log = createLogger({
    level: logLevel,
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss' // Format de la date dans les fichiers
        }),
        format.errors({ stack: true }), // pour afficher les stacks des erreurs
        align(), //method aligns the log messages
        envs.NODE_ENV === 'production' // gerer l'affichage des logs en fonction de l'environnement de dévéloppement
            ? format.json() // Production : logs au format JSON
            : format.prettyPrint() // Développement : logs plus lisibles
    ),
    defaultMeta: {
        service: 'user-service'
    },
    transports: [
        envs.NODE_ENV === 'production' ?
            new transports.Console({
                format: format.combine(
                    format.timestamp(),
                    format.json() // JSON output pour la console aussi
                ),
                level: 'info' // On affiche seulement 'info' et supérieur en production
            })
            :
            new transports.Console({
                format: format.combine(
                    colorize({ all: true }),
                    format.printf(({ level, message, timestamp }) => {
                        return `${timestamp} [${level}]: ${message}`;
                    })
                ),
                level: 'debug' // On affiche tous les niveaux en développement
            }), // pour afficher les logs dans la console
        transport, // Logs généraux avec rotation quotidienne
        errorTransport, // Fichier dédié pour les error avec rotation
        warnTransport, // Fichier dédié pour les warn avec rotation
        debugTransport, // Fichier dédié pour les warn avec rotation
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'logs/exceptions.log' }) // Capture les exceptions non interceptées
    ],
    rejectionHandlers: [
        new transports.File({ filename: 'logs/rejections.log' }) // Capture les promesses rejetées
    ]
});

export default log;
