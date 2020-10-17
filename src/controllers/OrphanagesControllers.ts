import {Request,Response} from "express";
import Orphanage from "../models/orphanages";
import { getRepository} from "typeorm";
import orphanageViews from '../views/orphanages_views';
import * as Yup from "yup";

export default {

    async index(req: Request, res: Response){
        const orphanageRepository = getRepository(Orphanage);
        const orphanages = await orphanageRepository.find(
            {relations: ['images']}
        )
        res.json(orphanageViews.renderMany(orphanages))   
     },
    
    async show(req: Request, res: Response){
        const { id } = req.params
        const orphanageRepository = getRepository(Orphanage);
        const orphanage = await orphanageRepository.findOneOrFail(id,{
            relations: ["images"]
        })
        res.json(orphanageViews.render(orphanage))
    },

    async create(req: Request,res: Response){
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends
        } = req.body
        const requestFiles = req.files as Express.Multer.File[];
        const images = requestFiles.map(images=>{
            return { path: images.filename};
        })
        const orphanageRepository = getRepository(Orphanage);
        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends: open_on_weekends === 'true',
            images

        }
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            images: Yup.array(Yup.object().shape({
                path: Yup.string().required()
            }))
        })

        await schema.validate(data,{
            abortEarly: false
        })
        const orphanage = orphanageRepository.create(data);
        await orphanageRepository.save(orphanage)
        return res.status(201).json(orphanage)
    }
}