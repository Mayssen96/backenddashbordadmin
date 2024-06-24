import { validationResult } from "express-validator";
import Astuce from "../models/astuceModel.js";

export function addOnce(req, res) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ errors: validationResult(req).array() });
  } else {
    Astuce.create({
      details: req.body.details,
      idUser: req.body.idUser,
    })
      .then((newAstuce) => {
        console.log(newAstuce);
        res.status(200).json({ newAstuce });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
}

export function getAll(req, res) {
  Astuce.find({})
    .then((astuces) => {
      res.status(200).json(astuces);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function updateOnce(req, res) {
  let newAstuce = {};
  newAstuce = {
    details: req.body.details,
    idUser: req.body.idUser,
  };

  Astuce.findByIdAndUpdate(req.params._id, newAstuce)
    .then((doc1) => {
      Astuce.findById(req.params._id)
        .then((doc) => {
          res.status(200).json(doc);
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
export function deleteOnce(req, res) {
  Astuce.findByIdAndDelete({ _id: req.params._id })
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
