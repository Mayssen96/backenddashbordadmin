import { validationResult } from "express-validator";
import Experience from "../models/experienceModel.js";
import cloudinary from "../cloudinary.js";

export function addOnce(req, res) {
  // Upload image to cloudinary
  cloudinary.uploader
    .upload(req.file.path)
    .then((result) => {
      if (!validationResult(req).isEmpty()) {
        res.status(400).json({ errors: validationResult(req).array() });
      } else {
        Experience.create({
          description: req.body.description,
          image: result.secure_url,
          idClient: req.body.idClient,
          idCategory: req.body.idCategory,
          cloudinary_id: result.public_id,
        })
          .then((newExperience) => {
            res.status(200).json({ newExperience });
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      }
    })
    .catch((err) => {
      console.log("error", JSON.stringify(err));
    });
}

export function getAll(req, res) {
  Experience.find({})
    .then((experiences) => {
      res.status(200).json(experiences);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function updateOnce(req, res) {
  let newExperience = {};
  Experience.findById(req.params._id)
    .then((doc) => {
      cloudinary.uploader.destroy(doc.cloudinary_id);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
  if (req.file == undefined) {
    newExperience = {
      description: req.body.description,
      idClient: req.body.idClient,
      idCategory: req.body.idCategory,
    };
  } else if (req.file) {
    cloudinary.uploader
      .upload(req.file.path)
      .then((result) => {
        newExperience = {
          description: req.body.description,
          image: result.secure_url,
          idClient: req.body.idClient,
          idCategory: req.body.idCategory,
          cloudinary_id: result.public_id,
        };
        Experience.findByIdAndUpdate(req.params._id, newExperience)
          .then((doc1) => {
            res.status(200).json(doc1);
          })
          .catch((err) => {
            res.status(500).json({ error: err });
          });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
}
export function deleteOnce(req, res) {
  Experience.findByIdAndDelete({ _id: req.params._id })
    .then((doc) => {
      cloudinary.uploader.destroy(doc.cloudinary_id);
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
