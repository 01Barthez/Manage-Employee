import nodemailer from 'nodemailer'
import { envs } from '../../../core/config/env';

// Configuration du transporteur de l'email
const transporter = nodemailer.createTransport({
    host: envs.MAIL_HOST,
    port: envs.MAIL_PORT,
    secure: envs.MAIL_SECURITY,
    auth: {
        user: envs.MAIL_ADDRESS,
        pass: envs.MAIL_PASSWORD
    },
});

export default transporter;
