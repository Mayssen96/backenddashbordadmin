import express from "express";
import {
  addOnce,
  getAll,
  deleteOnce,
} from "../controllers/experienceAstuceController.js";
import { body } from "express-validator";

const router = express.Router();

router.route("/:idAstuce/:idExperience").get(getAll).post(
  body("idAstuce"),
  body("idExperience"),
  addOnce
);
router.route("/").get(getAll);

router
  .route("/:_id")
  .delete(deleteOnce);
export default router;
