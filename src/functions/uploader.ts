import { Request } from "express";

const uploadImageToMinio = async (req: Request): Promise<string> => {
    try {
        const file = req.file;
        let imageURL = "";
        
        if(file) {
            imageURL = (req.file as Express.MulterS3.File).location;
        }

        return imageURL;
    } catch (error) {
        console.error('Error uploading to Minio', error);
        throw new Error('File upload failed');   
    }
}

export default uploadImageToMinio;