import throwError from '@src/utils/errors/throwError';
import bcrypt from 'bcrypt'

const hashText = async (plainText: string): Promise<string | undefined> => {
    try {
        const getRounds = 10;
        const salt = await bcrypt.genSalt(getRounds);
        const hashPassword = await bcrypt.hash(plainText, salt);

        return hashPassword;
    } catch (error) {
        throwError("Failed to hash password", error);
    }
}

const comparePassword = async (comparePlainText: string, compareHashPassword: string): Promise<boolean | undefined> => {
    try {        
        const resultat = await bcrypt.compare(comparePlainText, compareHashPassword);
        return resultat;
    } catch (error) {
        throwError("Failed to compare password", error);
    }
}

export { hashText, comparePassword };