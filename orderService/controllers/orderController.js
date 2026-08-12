import "dotenv/config"
import axios from "axios";
import {Kafka} from "kafkajs";
import {validationResult} from "express-validator";
import { Cart, Order } from "../models/schema.js";

const URL = process.env.KAFKA_BROKER
const kafka = new Kafka({
    clientId: "order-svc",
    brokers: [URL]
})

const orderProducer = kafka.producer();

export const handleCheckoutDisplay = async(req, res, next)=>{
    try{
        const {_id: userId} = req.user;

        const orders = await Order.find({userId}).sort({ createdAt: -1 });
        if(orders.length === 0){
            return res.status(200).json({message: "No order found", data: orders})
        }
        return res.status(200).json({success: true, message: "order detials", data: orders})

    }catch(err){
        next(err);
    }
}

export const handleCheckout = async(req, res, next)=>{
    try{
        const {_id: userId, email: userEmail} = req.user;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {houseno, street, city, pincode, state, mobileNumber, paymentType, paymentStatus} = req.body;
        
        const cart = await Cart.findOne({userId})

        if(!cart || cart.items.length === 0){
            return res.status(404).json({success: false, message: "Your cart is empty"})
        }

        if((paymentType === "UPI" || paymentType === "NET BANKING") && paymentStatus == "UNPAID") {
            return res.status(400).json({success: false, message: "please complete the payment first"})
        }

        if (paymentType === "COD" && paymentStatus !== "UNPAID") {
            return res.status(400).json({
                success: false,
                message: "COD orders should have UNPAID payment status"
            });
        }

        const maxDeliveryHours = Math.max(...cart.items.map((item) => item.estimatedDeliveryTime));

        const estimatedDeliveryTime = new Date(Date.now() + maxDeliveryHours * 60 * 60 * 1000);

        const order = await Order.create({
            userId, 
            userEmail,
            items: cart.items,
            totalAmount: cart.totalAmount,
            estimatedDeliveryTime: estimatedDeliveryTime,
            address:{
                houseno, 
                street, 
                city, 
                pincode, 
                state
            },
            mobileNumber, 
            paymentType, 
            paymentStatus
        })

        if((paymentStatus === "PAID") || (paymentType === "COD" && paymentStatus === "UNPAID" )){
            for (const item of cart.items) {
                await axios.patch(
                    `${process.env.CAKE_SVC_URL}/api/cake/updateAvailability/${item.productId}`,
                    {
                        quantity: item.quantity
                    }
                );
            }
            await Cart.findOneAndDelete({userId})
        }

        try{
            await orderProducer.connect();
            await orderProducer.send({
                topic: "order-placed-successfully",
                messages:[
                    {
                        value: JSON.stringify({
                            orderId: order._id.toString(),
                            userEmail: order.userEmail,
                            items: order.items.map(item => ({
                                productName: item.productName,
                                quantity: item.quantity
                            })),
                            totalAmount: order.totalAmount,
                            estimatedDeliveryTime: order.estimatedDeliveryTime,
                            paymentStatus: order.paymentStatus,
                            paymentType: order.paymentType
                        })
                    }
                ]
            })
        }catch(kafkaError){
            console.error("Order created but Kafka publishing failed:", kafkaError.message);
        }

        res.status(201).json({success: true, message: "order place", data: order})
    }catch(err){
        if (err.response) {
            console.log("Cake Service Error Status:", err.response.status);
            console.log("Cake Service Error Data:", err.response.data);
        } else {
            console.log("Error:", err.message);
        }
        next(err);
    }
}   