import "dotenv/config";
import { Kafka } from "kafkajs";

const URL = process.env.KAFKA_BROKER
console.log(URL)
const kafka = new Kafka({
    clientId: "Notification-svc",
    brokers: [URL]
})

const admin = kafka.admin();

const run = async()=>{
    await admin.connect();
    const created = await admin.createTopics({
        topics:[
            {topic: "order-placed-successfully"}
        ]
    })

    if(created){
        console.log("Topic Created")
    }else{
        console.log("Topic already exist")
    }
}

run();