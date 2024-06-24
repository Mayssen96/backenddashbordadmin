import mongoose from 'mongoose';

import avisdestinationModel from "./avisdestinationModel.js";


const { Schema, model } = mongoose;

const destinationSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    latitude: {
      type: Number,
      required: false
    },
    longitude: {
      type: Number,
      required: false
    },
    image: {
      type: Array,
      required: true
    },
    review: {
      type: [avisdestinationModel.schema], // Utilisez le schéma du modèle avisdestinationModel pour définir les avis
      required: false
    }

  },
  {
    timestamps: true
  }


);

export default model('Destination', destinationSchema);
