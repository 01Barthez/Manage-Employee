import objetsController from "@src/controllers/objet-controller"
import authUser from "@src/middleware/authUser"
// import roleUser from "@src/middleware/roleUser"
// import upload from "@src/middleware/upload-file"
import { validate, validator } from "@src/services/validator/validator"
import ROUTES from "@src/utils/mocks/mocks-routes"
import { Router } from "express"


const objet: Router = Router()

objet.get(
    ROUTES.OBJET.GET_ONE_objet,
    objetsController.get_one_objet
)

// Get all objets 
objet.get(
    ROUTES.OBJET.GET_MANY_objet,
    objetsController.get_many_objet
)

// Add new objet 
objet.post(
    ROUTES.OBJET.CREATE_ONE_objet,
    authUser,
    validator.validateobjet,
    validate,
    objetsController.create_one_objet
)

// Add Many objets 
objet.post(
    ROUTES.OBJET.CREATE_MANY_objet,
    // authUser,
    validator.validateobjet,
    validate,
    objetsController.create_many_objet
)

// Update objet
objet.put(
    ROUTES.OBJET.UPDATE_objet,
    authUser,
    // validator.validateobjet,
    // validate, 
    // upload.single('image'),
    objetsController.update_objet
)

// Delete One objet
objet.delete(
    ROUTES.OBJET.DELETE_ONE_objet,
    authUser,
    objetsController.delete_one_objet
)

// Delete ALL objet
objet.delete(
    ROUTES.OBJET.DELETE_MANY_objet,
    authUser,
    // roleUser("admin"),
    objetsController.delete_All_objets
)
export default objet;