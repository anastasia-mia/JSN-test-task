import * as superheroController from "./superhero.controller";
import {Router} from "express";

const router = Router();

router.post('/', superheroController.create)
router.patch('/:id', superheroController.update)
router.delete('/:id', superheroController.remove)

export const superheroRoutes = router;