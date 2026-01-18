import * as superheroController from "./superhero.controller";
import {Router} from "express";

const router = Router();

router.post('/', superheroController.create)

export const superheroRoutes = router;