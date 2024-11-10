import log from "@src/core/config/logger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const throwError = (message: string, error?: any) => {
    const errorMessage = error ? 
    `${message}: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    : message;
    log.error(errorMessage);
    throw new Error(errorMessage);
}

export default throwError