import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const AstuceSchema = new Schema(
    {
        details: {
            type: String,
            required: true
        },
        idUser: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

export default model('Astuce', AstuceSchema);