import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const experienceSchema = new Schema(
    {
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true,
            //unique:true
        },
        idClient: {
            type: String,
            required: true
        },
        idCategory: {
            type: String,
            required: true
        },
        cloudinary_id:{
            type:String,
            required:true
        }
    },
    {
        timestamps: true
    }
);

export default model('Experience', experienceSchema);