import mongoose from "mongoose";

const connectDB = () => {
    mongoose.connect('mongodb+srv://shahbazansari8998:j0jLR5BOulhmoRFs@sellit-pakistan.np0d4lt.mongodb.net/').then(()=> {
       console.log('MongoDB connected successfully.');
   }).catch((error) =>{
    console.log(error);
   })
}

export default connectDB