"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orphanages_1 = __importDefault(require("../models/orphanages"));
const typeorm_1 = require("typeorm");
const orphanages_views_1 = __importDefault(require("../views/orphanages_views"));
const Yup = __importStar(require("yup"));
exports.default = {
    async index(req, res) {
        const orphanageRepository = typeorm_1.getRepository(orphanages_1.default);
        const orphanages = await orphanageRepository.find({ relations: ['images'] });
        res.json(orphanages_views_1.default.renderMany(orphanages));
    },
    async show(req, res) {
        const { id } = req.params;
        const orphanageRepository = typeorm_1.getRepository(orphanages_1.default);
        const orphanage = await orphanageRepository.findOneOrFail(id, {
            relations: ["images"]
        });
        res.json(orphanages_views_1.default.render(orphanage));
    },
    async create(req, res) {
        const { name, latitude, longitude, about, instructions, opening_hours, open_on_weekends } = req.body;
        const requestFiles = req.files;
        const images = requestFiles.map(images => {
            return { path: images.filename };
        });
        const orphanageRepository = typeorm_1.getRepository(orphanages_1.default);
        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends: open_on_weekends === 'true',
            images
        };
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
        });
        await schema.validate(data, {
            abortEarly: false
        });
        const orphanage = orphanageRepository.create(data);
        await orphanageRepository.save(orphanage);
        return res.status(201).json(orphanage);
    }
};
