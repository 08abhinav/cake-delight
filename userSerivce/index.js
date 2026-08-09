import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "./lib/swagger.js";
import connectDB from "./db/dbConnection.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000
const startTime = Date.now();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use((err, req, res, next)=>{
    if(err.name === "ValidationError"){
        return res.status(400).json({message: err.message})
    }
    
    res.status(err.status || 500).json({message: err.message})
})

app.use('/api/user/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc))
app.use("/api/user", userRoutes);

app.get("/", (req, res)=>{
    return res.status(200).json({message: "Hello from user service"})
})

app.get("/health", (req, res)=>{
    const uptimeMs = Date.now() - startTime;

    const totalSeconds = Math.floor(uptimeMs / 1000);
    const totalMinutes = Math.floor(uptimeMs / (1000 * 60));
    const totalHours = Math.floor(uptimeMs / (1000 * 60 * 60));

    return res.status(200).json({
        serviceName: "User service",
        uptimeInSeconds: totalSeconds,
        uptimeInMinutes: totalMinutes,
        uptimeInHours: totalHours
    })
})

async function main(){
    try{
        await connectDB();
        app.listen(PORT, ()=>{
            console.log(`user service running on port: ${PORT}`)
        })
    }catch(err){
        console.log(`Application start up error: ${err}`)
    }
}
main();