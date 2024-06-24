import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const AvisDestinationSchema = new Schema(
  {
    idDestination: {
      type: String,
      required: true,

    },
    idClient: {
      type: String,
      required: true,
    },
    note: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: false
    },
    signals: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default model('AvisDestination', AvisDestinationSchema);
