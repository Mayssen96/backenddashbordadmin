import express from "express";
import {
  addOnce,
  getAll,
  updateOnce,
  deleteOnce,
} from "../controllers/astuceController.js";
import { body } from "express-validator";

const router = express.Router();

router
  .route("/")
  .get(getAll)
  .post(
    body("details").isLength({ min: 20, max: 200 }),
    body("idUser"),
    addOnce
  );

router
  .route("/:_id")
  .put(
    body("details").isLength({ min: 20, max: 200 }),
    body("idUser"),
    updateOnce
  )
  .delete(deleteOnce);
export default router;
