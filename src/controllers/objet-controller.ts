import prisma from "@src/core/config/prismaClient";
import { HttpCode } from "@src/core/constant";
import { customRequest } from "@src/core/interfaces/interfaces";
import generateSlug from "@src/functions/generateSlug";
import exceptions from "@src/utils/errors/exceptions";
import { GLOBAL_MSG, OBJET } from "@src/utils/mocks/mocks-message";
import { Request, Response } from "express";


const objetsController = {
    // Function to create One objet
    create_one_objet: async(req: customRequest, res: Response) => {
        try {
            // fetch data from body
            const {title, content} = req.body
            
            // Fetch the author id from the authenticated user
            const authorID = req.user?.user_id;
            if(!authorID) return  exceptions.unauthorized(res, GLOBAL_MSG.UNAUTHORIZED)
            
            // Check if the title is unique
            const TitleEverExist = await prisma.objet.findFirst({where: {title}});
            if(TitleEverExist) return exceptions.conflict(res, OBJET.CONFICT);

            // generate unique slug using the title
            const slug = generateSlug(title);
            
            // Make sure that the generated slug is really unique
            const isUnique = await prisma.objet.findFirst({where: {slug}});
            if(isUnique) return exceptions.badRequest(res, OBJET.UNIQUE_SLUG)
                
            // Define the update date at the date of the day
            const now = new Date();
            const createDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
                
            // Create a new objet using that informations
            const new_objet = await prisma.objet.create({
                data: {
                    title, content, slug,  createdAt: createDate
                },
                select:{
                    title: true, content: true, slug: true, createdAt: true
                }
            })
            // Send error message if error appear
            if(!new_objet) return exceptions.badRequest(res, GLOBAL_MSG.TRAITEMENT_FAILED)

            // Return success message if all is correct
            res.status(HttpCode.CREATED).json({msg: OBJET.CREATED, objet:  new_objet})
        } catch (error) {
            exceptions.serverError(res, error)
        }
    },

    // Function to create many objets
    create_many_objet: async(req: customRequest, res: Response) => {
        try {
            // fetch data from body
            const {title, content} = req.body
            
            // Fetch the author id from the authenticated user
            const authorID = req.user?.user_id;
            if(!authorID) return  exceptions.unauthorized(res, GLOBAL_MSG.UNAUTHORIZED)

            // generate unique slug using the title
            const slug = generateSlug(title);
            
            // Make sure that the generated slug is really unique
            const isUnique = await prisma.objet.findFirst({where: {slug}});
            if(isUnique) return exceptions.badRequest(res, OBJET.UNIQUE_SLUG)

            // Define the update date at the date of the day
            const now = new Date();
            const createDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())

            // Create a new objet using that informations
            const objets = await prisma.objet.createMany({
                data: [{title, content, slug, createdAt: createDate}]
            })
            if(objets.count === 0) return exceptions.badRequest(res, GLOBAL_MSG.TRAITEMENT_FAILED) 
                
            res.status(HttpCode.CREATED).json({msg: OBJET.CREATED, objets: objets})
        } catch (error) {
            exceptions.serverError(res, error)
        }
    },

    // Function to get/fetch One objet
    get_one_objet: async(req: Request, res: Response) => {
        try {
            // fetc bog ID from params
            const {objetID} = req.params

            const objet = await prisma.objet.findUnique({
                where: {objet_id: objetID},
                select: {
                    title: true, content: true, createdAt: true, updatedat: true, slug: true
                }
            })
            if(!objet) return exceptions.notFound(res, GLOBAL_MSG.NOT_FOUND)

            res.status(HttpCode.OK).json({msg: objet});
        } catch (error) {
            exceptions.serverError(res, error)
        }
    },

    // Function to get/fetch many objets
    get_many_objet: async(req: Request, res: Response) => {
        try {
            const objets = await prisma.objet.findMany({
                select: {
                    title: true, content: true, createdAt: true, updatedat: true, slug: true
                }
            });

            res.status(HttpCode.OK).json({msg: objets})
        } catch (error) {
            exceptions.serverError(res, error)
        }
    },

    // Function to modify/update One objet
    update_objet: async(req: customRequest, res: Response) => {
        try {
            // fetch data from params
            const {objetID} = req.params
   
            // fetch data from body
            const {title, content} = req.body
            
            // Fetch the author id from the authenticated user
              const objet = await prisma.objet.findUnique({where: {objet_id: objetID}});
            if(!objet) return exceptions.notFound(res, GLOBAL_MSG.NOT_FOUND);

            // Check if the new title is unique
            if(title && title !== objet.title) {
                const TitleEverExist = await prisma.objet.findFirst({where: {title}});
                if(TitleEverExist) return exceptions.conflict(res, OBJET.CONFICT);
            }

            // generate unique slug using the title
            const slug = generateSlug(title);

            // Make sure that the generated slug is really unique
            const isUnique = await prisma.objet.findFirst({where: {slug}});
            if(isUnique) return exceptions.badRequest(res, OBJET.UNIQUE_SLUG)

            // Define the update date at the date of the day
            const now = new Date();
            const updateDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())

            const new_objet = await prisma.objet.update({
                where: {objet_id: objetID},
                data: {
                    title, content, updatedat: updateDate
                },
                select:{
                    title: true, content: true, slug: true, createdAt: true, updatedat: true
                }
            })
            if(!new_objet) return exceptions.badRequest(res, GLOBAL_MSG.TRAITEMENT_FAILED)

            // Return success message if all is correct
            res.status(HttpCode.CREATED).json({msg: OBJET.UPDATE, objet:  new_objet})
        } catch (error) {
            exceptions.serverError(res, error)
        }
    },

    // Function to delete One objet
    delete_one_objet: async(req: customRequest, res: Response) => {
        try {
            const {objetID} = req.params
       
            const objet = await prisma.objet.findUnique({where: {objet_id: objetID}});
            if(!objet) return exceptions.notFound(res, GLOBAL_MSG.NOT_FOUND);
    
            await prisma.objet.delete({where: {objet_id: objetID}})

            res.status(HttpCode.OK).json({msg: GLOBAL_MSG.SUCCESS})
        } catch (error) {
            exceptions.serverError(res, error)
        }
    },

    // Function to delete many objet
    delete_All_objets: async(req: Request, res: Response) => {
        try {
            await prisma.objet.deleteMany()

            res.status(HttpCode.CREATED).json({msg: GLOBAL_MSG.SUCCESS})
        } catch (error) {
            exceptions.serverError(res, error)
        }
    },

}

export default objetsController;