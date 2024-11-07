import { getConfig } from "@src/servicesConfig/configService";

// eslint-disable @typescript-eslint/no-magic-numbers
export const ONE_THOUSAND = 100 as const;

export const allowedExtensionsProfile = ['.jpg', '.png', '.jpeg', '.svg'];
export const allowMimeTypeProfile = ['image/jpeg', 'image/png'];

export const MAX_BEGIN_HOURS = getConfig('max_begin_hours');
export const MAX_END_HOURS = getConfig('max_end_hours');
export const HOURS_OF_WORKS = getConfig('hours_of_works');
export const DAYS_OF_WORKS = getConfig('days_of_works');
export const SALARY_ROUND_FACTOR = getConfig('salary_round_factor');
export const MIN_SALARY = getConfig('min_salary');
export const holidays = getConfig('hollydays');

// export const MAX_BEGIN_HOURS = 8;
// export const MAX_END_HOURS = 20;

// export const HOURS_OF_WORKS = 8;
// export const DAYS_OF_WORKS = 25;

// export const SALARY_ROUND_FACTOR = 50;
// export const MIN_SALARY = 5000;


// export const holidays = [
// 	'01-01', // Le 1er janvier
// 	'02-01', // Le 02 janvier
// 	'24-12', // Le 24 decembre
// 	'25-12', // Le 25 decembre 
// 	'26-12', // Le 26 decembre
// 	'11-02', // Le 11 fevrier
// 	'01-05', // Le 20 mai
// 	'20-05', // Le 20 mai
// 	'26-12', // Le 26 decembre
// ]


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
