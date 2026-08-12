import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
    productId:{
        type: String,
        required: true
    },
    productName:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required: true
    }
}, {_id: false})

const ratingSchema = mongoose.Schema({
    userId:{
        type: String,
        required: true
    },
    items: [itemSchema]
},{timestamps: true})

export const Rating = mongoose.model("Rating", ratingSchema);