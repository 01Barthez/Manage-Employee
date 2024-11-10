import log from "@src/core/config/logger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const throwError = (message: string, error?: any) => {
    const errorMessage = error && error instanceof Error ?
        `${message}: ${error.message}`
        : message;

    log.error(errorMessage);
    throw new Error(errorMessage);
}

export default throwError