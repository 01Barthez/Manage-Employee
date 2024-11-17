import { getConfig } from "@src/services/servicesConfig/configService";

// eslint-disable @typescript-eslint/no-magic-numbers
export const ONE_THOUSAND = 100 as const;

export const allowedExtensionsProfile: string[] = ['.jpg', '.png', '.jpeg', '.svg'];
export const allowMimeTypeProfile: string[] = ['image/jpeg', 'image/png'];

export const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

export let MAX_BEGIN_HOURS: number;
export let MAX_END_HOURS: number;
export let HOURS_OF_WORKS: number;
export let DAYS_OF_WORKS: number;
export let SALARY_ROUND_FACTOR: number;
export let MIN_SALARY: number;
export let MIN_VALID_SALARY: number;
export let MAX_VALID_SALARY: number;
export let holidays: string[];

// Fonction pour charger les constantes une fois
export const loadConfigConstants = async () => {
    MAX_BEGIN_HOURS = (await getConfig('max_begin_hours')) || 8 as number;
    MAX_END_HOURS = (await getConfig('max_end_hours')) || 20 as number;
    HOURS_OF_WORKS = (await getConfig('hours_of_works')) || 8 as number;
    DAYS_OF_WORKS = (await getConfig('days_of_works')) || 25 as number;
    SALARY_ROUND_FACTOR = (await getConfig('salary_round_factor')) || 500 as number;
    MIN_SALARY = (await getConfig('min_salary')) || 10000 as number;
    MIN_VALID_SALARY = (await getConfig('min_valid_salary')) || 5000 as number;
    MAX_VALID_SALARY = (await getConfig('max_valid_salary')) || 5000000 as number;
    holidays = (await getConfig('hollydays')) || [
        '01-01', '02-01', '24-12', '25-12', '26-12', '31-12', '11-02', '01-05', '20-05',
    ] as string[];
};

export enum HttpCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    MOVE_PERMANENTLY = 301,
    FOUND = 302,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503
}
