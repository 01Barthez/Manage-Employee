import log from "@src/core/config/logger";
import { loadConfig } from "./configService";

try {
    loadConfig()
    log.info("config informations succfully loaded");
} catch (error) {
    const messageError = `Failed to load config informations ${error instanceof Error ? error.message : JSON.stringify(error)}`; 
    log.error(messageError);
    throw new Error(messageError);
}