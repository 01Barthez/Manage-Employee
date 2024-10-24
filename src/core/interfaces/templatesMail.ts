export interface ITemplateMail {
    name: string,
content: string
}

export interface ITemplateResetPassword {
name: string,
content: string
}

export interface ITemplateWelcome {
name: string,
content: string
}

export interface ITemplateOTP {
otpCode: number,
name: string
}
