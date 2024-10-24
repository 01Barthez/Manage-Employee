import log from '@src/core/config/logger';
import { envs } from '../../../core/config/env';
import templateManager from './template-manager';
import transporter from './transporter-config';

async function sendMail<K extends keyof typeof templateManager>(
    receiver: string, 
    subjet: string, 
    templateName: K, 
    templateData: any
) {
    try {
        const renderTemplate = templateManager[templateName];
        if (!renderTemplate) {
          throw new Error(`Unknown template: ${templateName}`);
        }

        const content = await renderTemplate(templateData);
        
        //options du message a envoyer
        const mailOptions = {
            from: `Universe Blog : ${envs.MAIL_ADDRESS}`,
            to: receiver,
            subject: subjet,
            html: content
        }

        // Envoi du message
        await transporter.sendMail(mailOptions)
    } catch (error) {
        log.error(`Error when trying to send mail: ${error}`)
        throw new Error(`Failed to send email to new user: ${error}`);
    }
}

export default sendMail;