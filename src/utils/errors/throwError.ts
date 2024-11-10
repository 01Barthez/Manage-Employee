import log from "@src/core/config/logger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const throwError = (message: string, error?: any) => {
    const messageError = `${message}: ${error && (error instanceof Error ? error.message : JSON.stringify(error))}`
    log.error(messageError);
    throw new Error(messageError);
}

export default throwError