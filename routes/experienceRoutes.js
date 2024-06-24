import express from "express";
import {
  addOnce,
  getAll,
  updateOnce,
  deleteOnce,
} from "../controllers/experienceController.js";
import multer from "../middlewares/multer-config.js";
import { body } from "express-validator";

const router = express.Router();

router
  .route("/")
  .get(getAll)
  .post(
    multer("image", 5 * 1024 * 1024),
    body("description").isLength({ min: 20,max:200 }),
    body("idClient"),
    body("idCategory"),
    body("cloudianry_id"),
    addOnce
  );

router
  .route("/:_id")
  .put(
    multer("image", 5 * 1024 * 1024),
    body("description").isLength({ min: 20,max:100 }),
    body("idClient"),
    body("idCategory"),
    body("cloudianry_id"),
    updateOnce
  )
  .delete(deleteOnce);
export default router;
