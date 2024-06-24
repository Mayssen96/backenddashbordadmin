
import AvisDestination from "../models/avisdestinationModel.js";
import { validationResult } from 'express-validator';

// Fonction pour obtenir tous les avis
export function getAll(req, res) {
    AvisDestination.find().populate('idDestination')
        .then((avis) => {
            res.status(200).json(avis);
        })
        .catch((error) => {
            res.status(500).json({ message: 'Erreur lors de la récupération des avis', error });
        });
}

// Fonction pour ajouter un nouvel avis
export function addOnce(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const avis = new AvisDestination(req.body);
    avis.save()
        .then((newAvis) => {
            res.status(201).json(newAvis);
        })
        .catch((error) => {
            res.status(400).json({ message: 'Erreur lors de la création de l\'avis', error });
        });
}

// Fonction pour obtenir un avis spécifique
export function getOnce(req, res) {
    AvisDestination.findById(req.params.id).populate('idDestination')
        .then((avis) => {
            if (!avis) {
                return res.status(404).json({ message: 'Avis non trouvé' });
            }
            res.status(200).json(avis);
        })
        .catch((error) => {
            res.status(500).json({ message: 'Erreur lors de la récupération de l\'avis', error });
        });
}

// Fonction pour mettre à jour un avis spécifique
export function putOnce(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    AvisDestination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        .then((avis) => {
            if (!avis) {
                return res.status(404).json({ message: 'Avis non trouvé' });
            }
            res.status(200).json(avis);
        })
        .catch((error) => {
            res.status(400).json({ message: 'Erreur lors de la mise à jour de l\'avis', error });
        });
}

// Fonction pour supprimer un avis spécifique
export function deleteOnce(req, res) {
    AvisDestination.findByIdAndDelete(req.params.id)
        .then((avis) => {
            if (!avis) {
                return res.status(404).json({ message: 'Avis non trouvé' });
            }
            res.status(200).json({ message: 'Avis supprimé avec succès' });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Erreur lors de la suppression de l\'avis', error });
        });
}
