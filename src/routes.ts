import { Router } from 'express';
import OrphanagesControllers from "./controllers/OrphanagesControllers"
import multer from "multer";
import uploudConfig from "./config/upload";

const router = Router();
const upload = multer(uploudConfig);

router.get('/orphanages', OrphanagesControllers.index)
router.get('/orphanages/:id', OrphanagesControllers.show)
router.post('/orphanages',upload.array('images'), OrphanagesControllers.create)


export default router;