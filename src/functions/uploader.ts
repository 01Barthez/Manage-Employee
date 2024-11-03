import log from "@src/core/config/logger";
import { Request } from "express";

const saveImage = async (req: Request): Promise<string> => {
    try {        
        let imageURL = "";
        if(req.file) {
            imageURL = (req.file as Express.MulterS3.File).location;
        }

        return imageURL;
    } catch (error) {
        log.error('Error uploading to Minio', error);
        throw new Error('File upload failed');   
    }
}

export default saveImage;