import log from "@src/core/config/logger";
import { HttpCode } from "@src/core/constant";
import { 
    NextFunction,
    Request,
    Response
} from "express";

const redirectURL = (req: Request, res: Response, next: NextFunction): void => {
    try {
        if(!req.secure){
            log.warn(`Alert: Unsecure Url: http://${req.hostname}${req.url}`)
            const secureUrl = `https://${req.hostname}${req.url}`;
            
            // Add HSTS Head
            log.warn(`Secure Url for redirection: ${secureUrl}`)
            return res.redirect(HttpCode.MOVE_PERMANENTLY, secureUrl);
        }

        next();
    } catch (error) {
        throw new Error(`Failed to redirect URL: http://${req.hostname}${req.url}\n: ${error}`);
    }
}

export default redirectURL