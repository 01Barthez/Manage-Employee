import fs from 'fs';
import ejs from 'ejs';
import path from 'path'
import {
     ITemplateMail, 
     ITemplateOTP, 
     ITemplateResetPassword
} from '../../../core/interfaces/templatesMail';

const templateManager = {
    mail: async (templateData: ITemplateMail): Promise<string> => {
        const templatePath = path.join(__dirname, '../templates/mail.ejs')
        const template = fs.readFileSync(templatePath, 'utf8');
        return  ejs.render(template, templateData)
    },

    otp: async (templateData: ITemplateOTP): Promise<string> => {
        const templatePath = path.join(__dirname, '../templates/otp.ejs')
        const template = fs.readFileSync(templatePath, 'utf8');
        return  ejs.render(template, templateData)
    },

    resetPassword: async (templateData: ITemplateResetPassword): Promise<string> => {
        const templatePath = path.join(__dirname, '../templates/reset-password.ejs')
        const template = fs.readFileSync(templatePath, 'utf8');
        return  ejs.render(template, templateData)
    },

    calculAverage: async (templateData: ITemplateMail): Promise<string> => {
        const templatePath = path.join(__dirname, '../templates/mail.ejs')
        const template = fs.readFileSync(templatePath, 'utf8');
        return  ejs.render(template, templateData)
    },

    // Your template here ......
}

export default templateManager;