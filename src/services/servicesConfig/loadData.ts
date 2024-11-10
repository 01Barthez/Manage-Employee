import log from "@src/core/config/logger";
import { loadConfig } from "./configService";
import throwError from "@src/utils/errors/throwError";

try {
    loadConfig()
    log.info("config informations succfully loaded");
} catch (error) {
    throwError('Failed to load config informations ', error);
}