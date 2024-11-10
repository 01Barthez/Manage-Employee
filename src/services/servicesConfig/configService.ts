import { KeySetting } from "@prisma/client";
import prisma from "@src/core/config/prismaClient"
import { IConfigCache } from "@src/core/interfaces/interfaces";

// Definition d'un objet pour stocker les configurations de l'application en mémoire
export const configCache: IConfigCache = {} as IConfigCache;

// Charger les configurations dépuis la base données
export const loadConfig = async () => {
    // On charge toutes les données de configuration car c'est indispensable
    const settings = await prisma.setting.findMany();
    settings.forEach(setting => {
        configCache[setting.key] = setting.value;
    })

    if (!configCache['days_of_works']) configCache['days_of_works'] = 25;
    if (!configCache['hours_of_works']) configCache['hours_of_works'] = 8;
    if (!configCache['max_begin_hours']) configCache['max_begin_hours'] = 8;
    if (!configCache['max_end_hours']) configCache['max_end_hours'] = 9;
    if (!configCache['min_salary']) configCache['min_salary'] = 10000;
    if (!configCache['salary_round_factor']) configCache['salary_round_factor'] = 500;
    if (!configCache['min_valid_salary']) configCache['min_valid_salary'] = 5000;
    if (!configCache['max_valid_salary']) configCache['max_valid_salary'] = 5000000;

    // Ajouter les jours fériées par défault
    if (!configCache['hollydays']) configCache['hollydays'] = [
        '01-01', // Le 1er janvier
        '02-01', // Le 02 janvier
        '24-12', // Le 24 decembre
        '25-12', // Le 25 decembre 
        '26-12', // Le 26 decembre
        '26-12', // Le 31 decembre
        '11-02', // Le 11 fevrier
        '01-05', // Le 01 mai
        '20-05', // Le 20 mai
    ];
}

// Fonctions pour recuperer une configuration
export const getConfig = (key: KeySetting) => {
    return configCache[key];
}
