import path from "path";
import fs, { existsSync } from 'fs';
import log from "@src/core/config/logger";
import throwError from "@src/utils/errors/throwError";

const fileExists = (filePath: string): boolean => existsSync(filePath);

const loadFile = (filePath: string, baseDir: string = __dirname): string => {
    try {
        // Get the full filePath
        const fileToLoad = path.resolve(baseDir, filePath);

        // check if the file does not exist and throw a warning
        if(!fileExists(fileToLoad)){
            const messageWarn = `File ${filePath} does not exist Please create it first...`
            log.warn(messageWarn);
            throw new Error(messageWarn);
        }
        
        // Wait for the complete read of file
        const file = fs.readFileSync(fileToLoad, 'utf-8'); 
        log.debug(`File ${filePath} loaded successfully !`);

        return file;
    } catch (error) {
        throwError(`Failed to load file: ${filePath}`, error);
        return '';
    }
}

export default loadFile