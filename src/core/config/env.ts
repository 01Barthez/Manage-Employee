import 'dotenv-safe/config';
import { get } from 'env-var';

export const envs = {
	//  Global Informations
	PORT: get('PORT').default(443).asPortNumber(),
	
	PORT2: get('PORT2').default(3000).asPortNumber(),
	
	API_PREFIX: get('DEFAULT_API_PREFIX').default('/api/v1').asString(),

	NODE_ENV: get('NODE_ENV').default('development').asString(),
	// Set Ratelimi params for App
	MAX_GLOBAL_QUERY_NUMBER: get('MAX_GLOBAL_QUERY_NUMBER').default('100').asInt(),
	MAX_GLOBAL_QUERY_WINDOW: get('MAX_GLOBAL_QUERY_WINDOW').default('60').asInt(),
	MAX_UNIQ_QUERY_NUMBER: get('MAX_UNIQ_QUERY_NUMBER').default('10').asInt(),
	MAX_UNIQ_QUERY_WINDOW: get('MAX_UNIQ_QUERY_WINDOW').default('30').asInt(),
	
	// DataBAse Information
	DATABASE_URL: get('DATABASE_URL').required().asString(),
	
	// About TLS Certificate
	TLS_PRIVATE_KEY: get('TLS_PRIVATE_KEY').required().asString(),
	TLS_CERTIFICATE: get('TLS_CERTIFICATE').required().asString(),
	
	REDIS_HOST: get('REDIS_HOST').default("localhost").asString(),
	REDIS_PORT: get('REDIS_PORT').default(6379).asPortNumber(),
	// REDIS_PASSWORD: get('REDIS_PASSWORD').required().asString(),
	// REDIS_USERNAME: get('REDIS_USERNAME').default('').asString(),
	LOCAL_CACHE_MAX_ITEMS: get('LOCAL_CACHE_MAX_ITEMS').default('100').asInt(),
	COMPRESSION_THRESHOLD: get('COMPRESSION_THRESHOLD').default('1024').asInt(),
	
	// Information about jwt tokens
	JWT_ALGORITHM: get('JWT_ALGORITHM').default("RS256").asString(),
	JWT_ACCESS_EXPIRES_IN: get('JWT_ACCESS_EXPIRES_IN').default("20min").asString(),
	JWT_REFRESH_EXPIRES_IN: get('JWT_REFRESH_EXPIRES_IN').default("14d").asString(),
	// About secret keys routes
	JWT_PRIVATE_KEY: get('JWT_PRIVATE_KEY').required().asString(),
	JWT_PUBLIC_KEY: get('JWT_PUBLIC_KEY').required().asString(),
	JWT_REFRESH_PRIVATE_KEY: get('JWT_REFRESH_PRIVATE_KEY').required().asString(),
	JWT_REFRESH_PUBLIC_KEY: get('JWT_REFRESH_PUBLIC_KEY').required().asString(),
	
	// About Cookies Setting
	JWT_COOKIE_DURATION: get('JWT_COOKIE_DURATION').default(2592000000).asInt(),
	JWT_COOKIE_HTTP_STATUS: get('JWT_COOKIE_HTTP_STATUS').default('true').asBool(),
	JWT_COOKIE_SECURITY: get('JWT_COOKIE_SECURITY').default('true').asBool(),
	
	// About OTP
	OTP_MAX_AGE: get('OTP_MAX_AGE').default(900000).asInt(),
	
	// About HSTS
	HSTS_MAX_AGE: get('HSTS_MAX_AGE').default(63072000).asInt(),
	
	// limit data size
	MAX_LIMIT_DATA: get('MAX_LIMIT_DATA').default(100).asInt(),
	
	// # configuration of mail sender
	MAIL_HOST: get('MAIL_HOST').default("gmail").asString(),
	MAIL_ADDRESS: get('MAIL_ADDRESS').required().asString(),
	MAIL_PASSWORD: get('MAIL_PASSWORD').required().asString(),
	MAIL_PORT: get('MAIL_PORT').default(465).asPortNumber(),
	MAIL_SECURITY: get('MAIL_SECURITY').default("true").asBool(),

	// # Configuration of S3 KEYS
	AWS_ACCESS_KEY_ID: get('AWS_ACCESS_KEY_ID').required().asString(),
	AWS_SECRET_ACCESS_KEY: get('AWS_SECRET_ACCESS_KEY').required().asString(),
	AWS_BUCKET_NAME: get('AWS_BUCKET_NAME').required().asString(),
	AWS_REGION: get('AWS_REGION').default("us-east-1 ").asString(),

	MINIO_ROOT_USER: get('MINIO_ROOT_USER').required().asString(),
	MINIO_ROOT_PASSWORD: get('MINIO_ROOT_PASSWORD').required().asString(),
	MIMIO_URL: get('MIMIO_URL').default("http://localhost:9000/").asUrlString(),

	// NGINX_HOST: get('NGINX_HOST').default("foobar.com").asUrlString(),
};
