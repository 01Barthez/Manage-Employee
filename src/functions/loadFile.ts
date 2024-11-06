import path from "path";
import fs, { existsSync } from 'fs';
import log from "@src/core/config/logger";

const fileExists = (filePath: string): boolean => existsSync(filePath);

const loadFile = (filePath: string, baseDir: string = __dirname): string => {
    try {
        // Get the full filePath
        const fileToLoad = path.resolve(baseDir, filePath);
        log.debug("fichier + chemin complet:" + fileToLoad);

        // check if the file does not exist and throw a warning
        if(!fileExists(fileToLoad)){
            const messageWarn = `File ${filePath} does not exist Please create it first...`
            log.warn(messageWarn);
            throw new Error(messageWarn);
        }
        
        // Wait for the complete read of file
        const file = fs.readFileSync(fileToLoad, 'utf-8'); 
        log.debug(`File ${filePath} loaded successfully !`);

        // return the listen file
        return file;
    } catch (error) {
        const message = `Error occured when loading file: ${filePath}: ${error instanceof Error ? error.message : JSON.stringify(error)}`;
        log.error(message)
        throw new Error(message);
    }
}

export default loadFile