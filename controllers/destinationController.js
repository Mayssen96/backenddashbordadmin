import Destination from "../models/destinationModel.js";
import { v2 as cloudinary } from 'cloudinary';
import { validationResult } from 'express-validator';

// Configuration de Cloudinary
cloudinary.config({
    cloud_name: "dguopbibx",
    api_key: "741624282143684",
    api_secret: "al4CadoJqF8jrpZHXTFHHNntXPk" // Click 'View Credentials' below to copy your API secret
});

export function getAll(req, res) {
    Destination.find({})
        .then((docs) => {
            let list = [];
            for (let i = 0; i < docs.length; i++) {
                list.push({
                    id: docs[i]._id,
                    name: docs[i].name,
                    description: docs[i].description,
                    latitude: docs[i].latitude,
                    longitude: docs[i].longitude,
                    image: docs[i].image,
                });
            }
            res.status(200).json(list);
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function addOnce(req, res) {
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({ errors: validationResult(req).array() });
    } else {
        cloudinary.uploader.upload(req.file.path, { use_filename: true, unique_filename: false, overwrite: true })
            .then(result => {
                const { name, description } = req.body;
                return Destination.create({
                    name,
                    description,
                    image: result.secure_url
                });
            })
            .then(newDestination => {
                res.status(200).json(newDestination);
            })
            .catch(err => {
                res.status(500).json({ error: err });
            });
    }
}

export function getOnce(req, res) {
    Destination.findById(req.params.id)
        .then((doc) => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({ message: "Destination not found" });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

export function putOnce(req, res) {
    const updateDestination = (newData) =>
        Destination.findByIdAndUpdate(req.params.id, newData, { new: true })
            .then(updatedDestination => {
                if (updatedDestination) {
                    res.status(200).json(updatedDestination);
                } else {
                    res.status(404).json({ message: 'Destination not found' });
                }
            })
            .catch(err => res.status(500).json({ error: err.message }));

    if (req.file) {
        Destination.findById(req.params.id)
            .then(destination => {
                if (!destination) throw new Error('Destination not found');

                const oldImageUrl = destination.image[0];
                if (oldImageUrl) {
                    const publicId = oldImageUrl.split('/').pop().split('.')[0];
                    return cloudinary.uploader.destroy(publicId);
                }
            })
            .then(() => cloudinary.uploader.upload(req.file.path, { use_filename: true, unique_filename: false, overwrite: true }))
            .then(result => updateDestination({ ...req.body, image: result.secure_url }))
            .catch(err => res.status(500).json({ error: err.message }));
    } else {
        updateDestination(req.body);
    }
}


export function deleteOnce(req, res) {
    Destination.findByIdAndDelete(req.params.id)
        .then(doc => {
            if (!doc) return res.status(404).json({ message: 'Destination not found' });

            if (doc.image && doc.image.length > 0) {
                const deletionPromises = doc.image.map(imageUrl => {
                    const publicId = imageUrl.split('/').pop().split('.')[0];
                    return cloudinary.uploader.destroy(publicId)
                        .then(result => console.log('Image deleted from Cloudinary:', result))
                        .catch(error => console.error('Error deleting image from Cloudinary:', error));
                });

                return Promise.all(deletionPromises)
                    .then(() => res.status(200).json({ message: 'Destination and associated images deleted successfully' }))
                    .catch(error => res.status(500).json({ error: 'Error deleting images' }));
            } else {
                res.status(200).json({ message: 'Destination deleted successfully' });
            }
        })
        .catch(err => res.status(500).json({ error: err.message }));
}
