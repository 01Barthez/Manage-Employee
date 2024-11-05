import log from '@src/core/config/logger';
import otpGenerator from 'otp-generator';

const generateSimpleOTP = (): string => {
    try {
        const otpGenerate = otpGenerator.generate(
            6, // Number of Caracters
            {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            }
        );

        // Return a string of number who will be our otp Number
        return otpGenerate;
    } catch (error) {
        log.error(`Error when trying to generate OTP: ${error}`);
        throw new Error(`Failed to generate OTP: ${error}`);
    }
}

export default generateSimpleOTP;