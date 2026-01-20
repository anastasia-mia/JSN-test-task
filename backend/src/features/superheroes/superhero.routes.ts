import * as superheroController from "./superhero.controller";
import {Router} from "express";
import {upload} from "../../shared/middlewares/upload.middleware";

const router = Router();

router.post('/', superheroController.create);
router.patch('/:id', superheroController.update);
router.delete('/:id', superheroController.remove);
router.get('/', superheroController.getList);
router.get('/:id', superheroController.getById);

router.post("/:id/images", upload.array("images", 10), superheroController.uploadImages);
router.post("/:id/main-image", upload.single("image"), superheroController.uploadMainImage);
router.patch("/:id/main-image", superheroController.setMainImage);
router.delete("/:id/images/:imageId", superheroController.deleteImage);

export const superheroRoutes = router;