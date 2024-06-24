import { validationResult } from 'express-validator';
import Categorie from '../models/categorieModel.js';
import cloudinary from '../cloudinary.js';

export function getAll(req, res) {
  Categorie.find({})
    .then(docs => {
      const list = docs.map(doc => ({
        id: doc._id,
        name: doc.name,
        description: doc.description,
        image: doc.image,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }));
      res.status(200).json(list);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}

export function addOnce(req, res) {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ errors: validationResult(req).array() });
  } else {

    cloudinary.uploader.upload(req.file.path, { use_filename: true, unique_filename: false, overwrite: true })
      .then(result => {
        const { name, description } = req.body;
        return Categorie.create({
          name,
          description,
          image: result.secure_url
        });
      })
      .then(newCategory => {
        res.status(200).json(newCategory);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }
}

export function getOnce(req, res) {
  Categorie.findById(req.params.id)
    .then(doc => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: 'Category not found' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}
export function putOnce(req, res) {
  const updateCategory = (newData) =>
    Categorie.findByIdAndUpdate(req.params.id, newData, { new: true })
      .then(updatedCategory => {
        if (updatedCategory) {
          res.status(200).json(updatedCategory);
        } else {
          res.status(404).json({ message: 'Category not found' });
        }
      })
      .catch(err => res.status(500).json({ error: err.message }));

  if (req.file) {
    Categorie.findById(req.params.id)
      .then(categorie => {
        if (!categorie) throw new Error('Category not found');

        const oldImageUrl = categorie.image[0];
        if (oldImageUrl) {
          const publicId = oldImageUrl.split('/').pop().split('.')[0];
          return cloudinary.uploader.destroy(publicId);
        }
      })
      .then(() => cloudinary.uploader.upload(req.file.path, { use_filename: true, unique_filename: false, overwrite: true }))
      .then(result => updateCategory({ ...req.body, image: result.secure_url }))
      .catch(err => res.status(500).json({ error: err.message }));
  } else {
    updateCategory(req.body);
  }
}

export function deleteOnce(req, res) {
  Categorie.findByIdAndDelete(req.params.id)
    .then(doc => {
      if (!doc) return res.status(404).json({ message: 'Category not found' });

      if (doc.image && doc.image.length > 0) {
        const deletionPromises = doc.image.map(imageUrl => {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          return cloudinary.uploader.destroy(publicId)
            .then(result => console.log('Image deleted from Cloudinary:', result))
            .catch(error => console.error('Error deleting image from Cloudinary:', error));
        });

        return Promise.all(deletionPromises)
          .then(() => res.status(200).json({ message: 'Category and associated images deleted successfully' }))
          .catch(error => res.status(500).json({ error: 'Error deleting images' }));
      } else {
        res.status(200).json({ message: 'Category deleted successfully' });
      }
    })
    .catch(err => res.status(500).json({ error: err.message }));
}
