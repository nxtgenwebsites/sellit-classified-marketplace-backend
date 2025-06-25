import mongoose from "mongoose";

const connectDB = () => {
    mongoose.connect(process.env.MONGO_URL).then(()=> {
       console.log('MongoDB connected successfully.');
   }).catch((error) =>{
    console.log(error);
   })
}

export default connectDB