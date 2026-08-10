import "dotenv/config"
import axios from "axios"
import {Rating} from "../models/schema.js"

export const handleRatingDisplay = async(req, res, next)=>{
    try{
        const {productId} = req.params;
        //todo validate productId

        const ratings = await Rating.find({"items.productId": productId});
        if(ratings.length === 0){
            return res.status(404).json({success: false, message: "no rating found"})
        }

        const items = ratings.flatMap(rating => rating.items);

        return res.status(200).json({success: true, data: items})
    }catch(err){
        next(err);
    }
}

export const handleRating = async (req, res, next) => {
    try {
        const { _id: userId } = req.user;
        const { productId, rating } = req.body;

        const response = await axios.get(
            `${process.env.ORDER_SVC_URL}/api/order/checkout`,
            {
                headers: {
                    Cookie: req.headers.cookie
                }
            }
        );

        const orders = response.data.data;
        let purchasedItem = null;

        for (const order of orders) {
            for (const item of order.items) {
                if (
                    String(item.productId) === String(productId)
                ) {
                    purchasedItem = item;
                    break;
                }
            }

            if (purchasedItem) break;
        }

        if (!purchasedItem) {
            return res.status(400).json({
                success: false,
                message: "You have not purchased this product yet"
            });
        }

        const userRating = await Rating.findOneAndUpdate(
            { userId },
            {
                $push: {
                    items: {
                        productId,
                        productName: purchasedItem.productName,
                        rating
                    }
                }
            },
            {
                new: true,
                upsert: true
            }
        );

        return res.status(201).json({
            success: true,
            message: "Thank you for rating the product",
            data: userRating
        });

    } catch (err) {
        console.log("RATING ERROR:", err);
        next(err);
    }
};

export const handleAverageRating = async (req, res, next) => {
    try {
        const { productId } = req.params;

        const ratings = await Rating.find({"items.productId": productId});
        if (ratings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No ratings found for this product"
            });
        }

        let totalRating = 0;
        let totalRatings = 0;

        for (const userRating of ratings) {
            for (const item of userRating.items) {
                if (String(item.productId) === String(productId)) {
                    totalRating += item.rating;
                    totalRatings++;
                }
            }
        }

        const averageRating = totalRating / totalRatings;

        return res.status(200).json({
            success: true,
            productId,
            totalRatings,
            averageRating: Number(averageRating.toFixed(1))
        });

    } catch (err) {
        next(err);
    }
};