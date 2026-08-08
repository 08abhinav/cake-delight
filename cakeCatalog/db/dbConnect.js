import "dotenv/config"
import mongoose from "mongoose";

const URL=process.env.MONGO_URL
async function connectDB(){
    try{
        await mongoose.connect(URL);
        console.log("MongoDB connected successfully")
    }catch(err){
        console.log(`Mongodb connection error: ${err.message}`)
    }
}
export default connectDB;