import express from 'express';
import { body } from 'express-validator';

import multer from "../middlewares/multer-config.js";
import { getAll, addOnce, getOnce, putOnce, deleteOnce } from "../controllers/destinationController.js";

const router = express.Router();


router
  .route("/")
  .get(getAll)
  .post( multer("image"), [
    body('name').isLength({ min: 5 }),
    body('description').isLength({ min: 5 })
  ], addOnce);

router.route('/:id')
  .get(getOnce)
  .put( multer("image"), [
    body('name').isLength({ min: 5 }),
    body('description').isLength({ min: 5 })
  ], putOnce)
  .delete(deleteOnce);

export default router;

