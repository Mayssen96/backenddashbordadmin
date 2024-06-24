import express from 'express';

import { body } from 'express-validator';
import { getAll, addOnce, getOnce, putOnce, deleteOnce } from '../controllers/categorieController.js';
import multer from "../middlewares/multer-config.js";
const router = express.Router();


router.route('/')
  .get(getAll)
  .post( multer("image", 5 * 1024 * 1024), [
    body('name').isLength({ min: 5 }),
    body('description').isLength({ min: 5 })
  ], addOnce);

router.route('/:id')
  .get(getOnce)
  .put( multer("image", 5 * 1024 * 1024), [
    body('name').isLength({ min: 5 }),
    body('description').isLength({ min: 5 })
  ], putOnce)
  .delete(deleteOnce);

export default router;
