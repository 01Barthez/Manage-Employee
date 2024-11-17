import log from "@src/core/config/logger";
import { loadConfig } from "./configService";
import { loadConfigConstants } from "@src/core/constant";

export const configService = async () => {
    try {
        await loadConfig()
        await loadConfigConstants();
    } catch (error) {
        throw new Error(`Failed to load config informations: ${error}`);
    }
}
configService().then(() => {
    log.info("config informations succfully loaded !");
});