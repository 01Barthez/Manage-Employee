import uploadImageToMinio from "@src/functions/uploader";
import upload from "@src/middleware/upload-file";
import ROUTES from "@src/utils/mocks/mocks-routes";
import { Router } from "express";


const uploadIMG: Router = Router(); 

uploadIMG.post(
    ROUTES.UPLOAD.UPLOAD, 
    upload.single('image'),
    uploadImageToMinio
)
    
export default uploadIMG;
