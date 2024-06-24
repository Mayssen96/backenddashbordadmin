import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            
        },
        lastName: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        birthDate: {
            type: Date,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role:{
            type : String,
            required: true
            },
            
        verificationToken :{
            type: String,
           
        }  ,
        status:{
            type : Boolean,
            
         
        },
        resetPasswordToken: { 
            type: String 
        },
        resetPasswordExpires: { 
            type: Date
        }
        

    },
    {
        timestamps: true
    }
);

export default model('User', userSchema);