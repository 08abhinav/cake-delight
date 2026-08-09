import mongoose from "mongoose"

const cakeSchema = mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        minlength: [5, "name must be atleast 5 characters long"]
    },
    description:{
        type: String,
        trim: true,
        required: true,
        minlength: [10, "description must be atleast 10 characters long"]
    },
    category:{
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        minlength: [5, "name must be atleast 5 characters long"]
    },
    price:{
        type: Number,
        required: true,
        min: [1, "price should be greater than 0"]
    },
    availability:{
        type: Number,
        default: 0
    },
    estimatedDeliveryTime:{
        type: Number,
        required: true
    },
    image:{
        type: String
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true})

export const Cake = mongoose.model("Cake", cakeSchema);