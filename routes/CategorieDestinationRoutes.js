import express from 'express';
import { body } from 'express-validator';
import {addOnce,getAll,getCategoriesByDestination,deleteOnce,
    getDestinationsByCategory
} from "../controllers/CategorieDestinationController.js"

const router = express.Router();


router.route('/')
    .get(getAll)
    .post(
        body('idDestination'),
        body('idCategorie'),
       addOnce
    );

router.route('/:id')
    
    .delete(deleteOnce);

// Routes spécifiques
router.get('/destination/:idDestination/categories', getCategoriesByDestination);
router.get('/category/:idCategorie/destinations', getDestinationsByCategory);

export default router;
