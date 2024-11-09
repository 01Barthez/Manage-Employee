import {S3Client} from '@aws-sdk/client-s3'
import { envs } from '@src/core/config/env';

const s3 = new S3Client({
    region: envs.AWS_REGION,
    credentials: {
        accessKeyId: envs.MINIO_ROOT_USER, // envs.AWS_ACCESS_KEY_ID,
        secretAccessKey: envs.MINIO_ROOT_PASSWORD // envs.AWS_SECRET_ACCESS_KEY,
    },
     
    // Parcequ'on utilise minio
    endpoint: envs.MIMIO_URL,
    forcePathStyle: true,
})

export default s3;
