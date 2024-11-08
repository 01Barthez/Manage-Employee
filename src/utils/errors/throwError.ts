import log from "@src/core/config/logger";


const throwError = (message: string, error: any) => {
    const messageError = `${message}: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    log.error(messageError);
    throw new Error(messageError);
}

export default throwError