import { IResponse } from "@src/core/interfaces/interfaces"

// Pour utiliser le meme format de reponse pour les messages renvoyées au front-end
const ResponseMSG = (msg: string, success: boolean = true,  data?: any): IResponse => {
    return {success, msg, data}
}

export default ResponseMSG;