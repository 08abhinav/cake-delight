import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./db/dbConnect.js"
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
const PORT = process.env.PORT || 3002
const startTime = Date.now();

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());
app.use(cookieParser());
app.use((err, req, res, next)=>{
    res.status(err.status || 500).json({message: "Internal server error"})
})

app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

app.get("/", (req, res)=>{
    return res.status(200).json({message: "Hello from order service"})
})

app.get("/health", (req, res)=>{
    const uptimeMs = Date.now() - startTime;

    const totalSeconds = Math.floor(uptimeMs / 1000);
    const totalMinutes = Math.floor(uptimeMs / (1000 * 60));
    const totalHours = Math.floor(uptimeMs / (1000 * 60 * 60));

    return res.status(200).json({
        serviceName: "Order service",
        uptimeInSeconds: totalSeconds,
        uptimeInMinutes: totalMinutes,
        uptimeInHours: totalHours
    })
})

async function main(){
    try{
        await connectDB();
        app.listen(PORT, ()=>{
            console.log(`Order service running on PORT: ${PORT}`)
        })
    }catch(err){
        console.log(`Application startup erro: ${err.message}`)
    }
}
main();