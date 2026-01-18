import {Router} from 'express';
import {superheroRoutes} from "./features/superheroes/superhero.routes"

const router = Router();

router.use('/superheroes', superheroRoutes);

export default router;