import fs from 'fs';
import ejs from 'ejs';
import path from 'path'
import {
     ITemplateMail, 
     ITemplateResetPassword,
     ITemplaSalary
} from '../../../core/interfaces/templatesMail';

const templateManager = {
    otp: async (templateData: ITemplateMail): Promise<string> => {
        const templatePath = path.join(__dirname, '../templates/otp.ejs')
        const template = fs.readFileSync(templatePath, 'utf8');
        return  ejs.render(template, templateData)
    },
   
    resetPassword: async (templateData: ITemplateResetPassword): Promise<string> => {
        const templatePath = path.join(__dirname, '../templates/reset-password.ejs')
        const template = fs.readFileSync(templatePath, 'utf8');
        return  ejs.render(template, templateData)
    },

    sendSalary: async (templateData: ITemplaSalary): Promise<string> => {
        const templatePath = path.join(__dirname, '../templates/send-employee-salary.ejs')
        const template = fs.readFileSync(templatePath, 'utf8');
        return  ejs.render(template, templateData)
    },

    // Other templates here ......
}

export default templateManager;