import { Request } from "express";

const uploadImage = (req: Request): string | null => {
    const profileUrl = req.file ? (req.file as Express.MulterS3.File).location : null;
    return profileUrl; 
}

export default uploadImage;