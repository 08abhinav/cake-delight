import "dotenv/config";
import express from "express";
import { Kafka } from "kafkajs";
import bodyParser from "body-parser";
import { sendOrderConfirmation } from "./lib/emailService.js";

const app = express();
const PORT = process.env.PORT || 3004;

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());

const URL = process.env.KAFKA_BROKER
console.log(URL)

const kafka = new Kafka({
    clientId: "Notification-svc",
    brokers: [URL]
})

const notifyConsumer = kafka.consumer({groupId: "notify-service"})

const run = async ()=>{
    try{
        await notifyConsumer.connect();
        await notifyConsumer.subscribe({
            topics: ["order-placed-successfully"],
            fromBeginning: true
        })

        await notifyConsumer.run({
            eachMessage: async ({topic, partition, message})=>{
                const value = JSON.parse(message.value.toString())

                await sendOrderConfirmation(
                    value.userEmail,
                    value.items,
                    value.totalAmount,
                    value.estimatedDeliveryTime,
                    value.paymentStatus,
                    value.paymentType
                );
            }
        })
    }catch(err){
        console.error("Notification service error:", err);
    }
}
run();

app.get("/", (req, res)=>{
    return res.status(200).json({message: "Hello from notification service"})
})

app.listen(PORT, ()=>{console.log(`Notification service running on PORT: ${PORT}`)})