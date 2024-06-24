import { validationResult } from "express-validator";
import ExperienceAstuce from "../models/experienceAstuceModel.js";
import Astuce from "../models/astuceModel.js";
import Experience from "../models/experienceModel.js";

export function addOnce(req, res) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ errors: validationResult(req).array() });
  } else {
    Experience.findById(req.params.idExperience)
      .then((exp) => {
        Astuce.findById(req.params.idAstuce)
          .then((ast) => {
            ExperienceAstuce.create({
              idAstuce: req.params.idAstuce,
              idExperience: req.params.idExperience,
            })
              .then((newExperienceAstuce) => {
                res.status(200).json({ newExperienceAstuce });
              })
              .catch((err) => {
                res.status(500).json({ error: err });
              });
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
export function getAll(req, res) {
  ExperienceAstuce.find({})
    .then((expas) => {
      res.status(200).json(expas);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function deleteOnce(req, res) {
    ExperienceAstuce.findByIdAndDelete({ _id: req.params._id })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }