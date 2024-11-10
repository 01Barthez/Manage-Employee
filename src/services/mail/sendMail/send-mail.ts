import { envs } from '../../../core/config/env';
import templateManager from './template-manager';
import transporter from './transporter-config';
import throwError from '@src/utils/errors/throwError';

async function sendMail<K extends keyof typeof templateManager>(
    receiver: string,
    subjet: string,
    templateName: K,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    templateData: any
) {
    try {
        const renderTemplate = templateManager[templateName];
        if (!renderTemplate) {
            throwError(`Failed to render template ${templateName}`)
        }

        const content = await renderTemplate(templateData);

        //&options du message a envoyer
        const mailOptions = {
            from: `Employee WorketYamo : ${envs.MAIL_ADDRESS}`,
            to: receiver,
            subject: subjet,
            html: content
        }

        // Envoi du message
        await transporter.sendMail(mailOptions)
    } catch (error) {
        throwError(`Failed to send email to new user`, error);
    }
}

export default sendMail;