import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const categoriedestinationSchema = new Schema(
    {
        idDestination: {
            type: String,
            required: true
        },
        idCategorie: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default model('CategorieDestination', categoriedestinationSchema);
