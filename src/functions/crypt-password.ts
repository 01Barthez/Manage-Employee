import log from '@src/core/config/logger';
import bcrypt from 'bcrypt'

const hashText = async (plainText: string): Promise<string> => {
    try {
        const getRounds = 10;
        log.debug("Generating salt...");
        const salt = await bcrypt.genSalt(getRounds);
        log.debug("Salt generated:", salt);
        
        log.debug("Hashing password...");
        const hashPassword = await bcrypt.hash(plainText, salt);
        log.debug("Password hashed:", hashPassword);

        return hashPassword;
    } catch (error) {
        log.error(`erreur lors du hashage du mot de Passe: ${error}`);
        throw new Error(`Failed to hash password ${error}`);
    }
}

const comparePassword = async (comparePlainText: string, compareHashPassword: string) => {
    const resultat = await bcrypt.compare(comparePlainText, compareHashPassword);
    return resultat;
}

export { hashText, comparePassword };