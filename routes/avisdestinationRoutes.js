
import express from "express";
import { body } from "express-validator";
import { getAll, addOnce, getOnce, putOnce, deleteOnce } from "../controllers/avisdestinationController.js";

const router = express.Router();

// Route pour obtenir tous les avis et ajouter un nouvel avis
router.route('/')
  .get(getAll)
  .post(

    body('idDestination').isMongoId(),
    body('note').isInt({ min: 0, max: 5 }),
    body('comment').isString(),
    addOnce
  );

// Route pour obtenir, mettre à jour et supprimer un avis spécifique
router.route('/:id')
  .get(getOnce)
  .put(putOnce)
  .delete(deleteOnce);

export default router;