import loadFile from "@src/functions/loadFile";
import { envs } from "./env";

const keys = {
    // Retrieve files for TLS signature if necessary (LAZY loading)
    tls: {
        get privateKey(): string { return loadFile(envs.TLS_PRIVATE_KEY, '') }, 
        get certificate(): string { return loadFile(envs.TLS_CERTIFICATE, '') }, 
    },

    // Retrieve files for JWT signature if necessary (LAZY loading)
    jwt: {
        get privateKey(): string { return loadFile(envs.JWT_PRIVATE_KEY, '') },
        get publicKey(): string { return loadFile(envs.JWT_PUBLIC_KEY, '') },
        get refreshPrivateKey(): string { return loadFile(envs.JWT_REFRESH_PRIVATE_KEY, '') }, 
        get refreshPublicKey(): string { return loadFile(envs.JWT_REFRESH_PUBLIC_KEY, '') }, 
    }
}

export default keys