import nodemailer from 'nodemailer'
import { envs } from '../../../core/config/env';

const emailConfig = {
    email: envs.MAIL_ADDRESS,
    password: envs.MAIL_PASSWORD
}
const validateEmailConfig = () => {
    if(!emailConfig.email || !emailConfig.password){
        console.error("email address or password not config!");
        process.exit(1);
    }
};
validateEmailConfig();

// Configuration du transporteur de l'email
const transporter = nodemailer.createTransport({
    host: envs.MAIL_HOST,
    port: envs.MAIL_PORT,
    secure: envs.MAIL_SECURITY,
    auth: {
        user: emailConfig.email,
        pass: emailConfig.password,
    },
});

export default transporter;
