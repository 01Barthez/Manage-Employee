import { IResponse } from "@src/core/interfaces/interfaces"

//& Pour utiliser le meme format de reponse pour les messages renvoyées au front-end

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ResponseMSG = (msg: string, success: boolean = true,  data?: any): IResponse => {
    return {success, msg, data}
}

export default ResponseMSG;