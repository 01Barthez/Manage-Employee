import log from "@src/core/config/logger";
import { loadConfig } from "./configService";

try {
    loadConfig()
    log.info("config informations succfully loaded");
} catch (error) {
    throw new Error(`Failed to load config informations: ${error}`);
}