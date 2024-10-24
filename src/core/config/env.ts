// src/core/config/env.ts

import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
	//  Global Informations
	PORT: get('PORT').required().asPortNumber(),
	API_PREFIX: get('DEFAULT_API_PREFIX').default('/api/v1').asString(),
	NODE_ENV: get('NODE_ENV').default('development').asString(),

	// Set Ratelimi params for App
	MAX_GLOBAL_QUERY_NUMBER: get('MAX_GLOBAL_QUERY_NUMBER').default('100').asInt(),
	MAX_GLOBAL_QUERY_WINDOW: get('MAX_GLOBAL_QUERY_WINDOW').default('60').asInt(),
	MAX_UNIQ_QUERY_NUMBER: get('MAX_UNIQ_QUERY_NUMBER').default('10').asInt(),
	MAX_UNIQ_QUERY_WINDOW: get('MAX_UNIQ_QUERY_WINDOW').default('30').asInt(),
	

	// DataBAse Inforlation
	MONGO_INITDB_ROOT_USERNAME: get('MONGO_INITDB_ROOT_USERNAME').default('admin').asString(),
	MONGO_INITDB_ROOT_PASSWORD: get('MONGO_INITDB_ROOT_PASSWORD').default('test123').asString(),
	MONGO_DB_NAME: get('MONGO_DB_NAME').default('worketyamo').asString(),
	
	// Information about jwt tokens
	JWT_ALGORITHM: get('JWT_ALGORITHM').default("RS256").asString(),
	JWT_ACCESS_EXPIRES_IN: get('JWT_ACCESS_EXPIRES_IN').default("20min").asString(),
	JWT_REFRESH_EXPIRES_IN: get('JWT_REFRESH_EXPIRES_IN').default("30d").asString(),
	JWT_PRIVATE_KEY: get('JWT_PRIVATE_KEY').default("./keys/private.key").asString(),
	JWT_PUBLIC_KEY: get('JWT_PUBLIC_KEY').default("./keys/public.key").asString(),
	JWT_REFRESH_PRIVATE_KEY: get('JWT_REFRESH_PRIVATE_KEY').default("./keys/refresh-private.key").asString(),
	JWT_REFRESH_PUBLIC_KEY: get('JWT_REFRESH_PUBLIC_KEY').default("./keys/refresh-public.key").asString(),
	
	JWT_COOKIE_DURATION: get('JWT_COOKIE_DURATION').default(5000).asInt(),
	JWT_COOKIE_HTTP_STATUS: get('JWT_COOKIE_HTTP_STATUS').default('true').asBool(),
	JWT_COOKIE_SECURITY: get('JWT_COOKIE_SECURITY').default('true').asBool(),
	
	// # configuration of mail sender
	MAIL_HOST: get('MAIL_HOST').default("gmail").asString(),
	MAIL_ADDRESS: get('MAIL_ADDRESS').default("address@gmail.com").asString(),
	MAIL_PASSWORD: get('MAIL_PASSWORD').default("password").asString(),
	MAIL_PORT: get('MAIL_PORT').required().asPortNumber(),
	MAIL_SECURITY: get('MAIL_SECURITY').default("false").asBool(),

	// # Configuration of S3 KEYS
	AWS_ACCESS_KEY_ID: get('AWS_ACCESS_KEY_ID').default("your_access_key").asString(),
	AWS_SECRET_ACCESS_KEY: get('AWS_SECRET_ACCESS_KEY').default("your_secret_key").asString(),
	AWS_REGION: get('AWS_REGION').default("your_region").asString(),
	AWS_BUCKET_NAME: get('AWS_BUCKET_NAME').default("your_bucket_name").asString(),
	MIMIO_URL: get('MIMIO_URL').default("http://localhost:9000/").asUrlString(),
};

export const CONNECTION_STRING = `mongodb://${envs.MONGO_INITDB_ROOT_USERNAME}:${envs.MONGO_INITDB_ROOT_PASSWORD}@172.28.0.2:27017/${envs.MONGO_DB_NAME}?authSource=admin`;
