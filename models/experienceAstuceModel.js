import mongoose from "mongoose";
const { Schema, model } = mongoose;

const experienceAstuceSchema = new Schema(
  {
    idExperience : {
        type: String,
        required: true
    },
    idAstuce: {
        type: String,
        required: true
    }
  },
  {
    timestamps: true,
  }
);

export default model("ExperienceAstuce", experienceAstuceSchema);
