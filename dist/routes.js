"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const OrphanagesControllers_1 = __importDefault(require("./controllers/OrphanagesControllers"));
const multer_1 = __importDefault(require("multer"));
const upload_1 = __importDefault(require("./config/upload"));
const router = express_1.Router();
const upload = multer_1.default(upload_1.default);
router.get('/orphanages', OrphanagesControllers_1.default.index);
router.get('/orphanages/:id', OrphanagesControllers_1.default.show);
router.post('/orphanages', upload.array('images'), OrphanagesControllers_1.default.create);
exports.default = router;
