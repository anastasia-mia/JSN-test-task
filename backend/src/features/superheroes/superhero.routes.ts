import * as superheroController from "./superhero.controller";
import {Router} from "express";

const router = Router();

router.post('/', superheroController.create);
router.patch('/:id', superheroController.update);
router.delete('/:id', superheroController.remove);
router.get('/', superheroController.getList);
router.get('/:id', superheroController.getById);

export const superheroRoutes = router;