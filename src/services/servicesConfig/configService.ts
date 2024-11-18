import { KeySetting } from "@prisma/client";
import prisma from "@src/core/config/prismaClient"
import {redisClient} from "../cache/redisClient";
import log from "@src/core/config/logger";

// Charger les configurations dépuis la base données
export const loadConfig = async () => {
    // On charge toutes les données de configuration car c'est indispensable
    const settings = await prisma.setting.findMany();

    // Save into redis
    settings.forEach(async (setting) => {
        await redisClient.set(setting.key, setting.value);
    })

    // Default configurations if setting not exist in redis
    const defaultConfigs = {
        'days_of_works': 25,
        'hours_of_works': 8,
        'max_begin_hours': 8,
        'max_end_hours': 20,
        'min_salary': 10000,
        'salary_round_factor': 500,
        'min_valid_salary': 5000,
        'max_valid_salary': 5000000,
        'hollydays': JSON.stringify([
            '01-01', '02-01', '24-12', '25-12', '26-12', '31-12', '11-02', '01-05', '20-05',
        ]),
    };

    for (const [key, value] of Object.entries(defaultConfigs)) {
        const exists = await redisClient.exists(key);  // Vérifie si la clé existe dans Redis
        if (!exists) {
            await redisClient.set(key, JSON.stringify(value));  // Stocke dans Redis
        }
    }
}

// Fonctions pour recuperer une configuration
export const getConfig = async (key: KeySetting) => {
    const value = await redisClient.get(key);
    if (value) {

        try {
            return JSON.parse(value) 
        } catch (error) {
            log.warn(error);
            return value;
        }
    }
    return null;
}
