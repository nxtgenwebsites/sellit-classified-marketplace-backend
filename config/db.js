import mongoose from "mongoose";

const connectDB = () => {
    mongoose.connect('mongodb+srv://shahbazansari8998:aRfKENwql8bxbGH0@portfolio.u4rpgss.mongodb.net/sellit-pakistan').then(()=> {
       console.log('MongoDB connected successfully.');
   }).catch((error) =>{
    console.log(error);
   })
}

export default connectDB