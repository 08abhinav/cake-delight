import "dotenv/config"
import express from "express"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./db/dbConnect.js";
import ratingRoutes from "./routes/ratingRoutes.js";

const app = express()
const PORT = process.env.PORT || 3003
const startTime = Date.now();

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());
app.use(cookieParser());
app.use((err, req, res, next)=>{
    if(err.name === "ValidationError"){
        return res.status(err.status).json({message: err.message})
    }
    return res.status(err.status || 500).json({message: err.message})
})

app.use("/api/rating", ratingRoutes);

app.get("/", (req, res)=>{
    return res.status(200).json({message: "Hello from rating service"})
})

app.get("/health", (req, res)=>{
    const uptimeMs = Date.now() - startTime;

    const totalSeconds = Math.floor(uptimeMs / 1000);
    const totalMinutes = Math.floor(uptimeMs / (1000 * 60));
    const totalHours = Math.floor(uptimeMs / (1000 * 60 * 60));

    return res.status(200).json({
        serviceName: "Rating service",
        uptimeInSeconds: totalSeconds,
        uptimeInMinutes: totalMinutes,
        uptimeInHours: totalHours
    })
})

async function main(){
    try{
        await connectDB();
        app.listen(PORT, ()=>{
            console.log(`Applicaiton running on PORT: ${PORT}`)
        })
    }catch(err){
        console.log("Cake catalog start up error: ", err.message);
    }
}
main()