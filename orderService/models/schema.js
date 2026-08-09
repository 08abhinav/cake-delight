import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: String
  },
  productName: {
    type: String
  },
  price: {
    type: Number
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    default: 1
  },
  estimatedDeliveryTime:{
    type: String, 
    required: true
  }
}, { _id: false });


const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    index: true
  },
  userEmail: {
    type: String
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });


cartSchema.pre("save", function () {
  this.totalAmount = this.items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
});


const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },

  userEmail: {
    type: String,
    required: true
  },

  items: [cartItemSchema],

  totalAmount:{
    type: Number,
    required: true
  },
  
  address:{
    houseno:{
      type: String,
      required: true
    },
    street:{
      type: String,
      required: true
    },
    city:{
      type: String,
      required: true
    },
    pincode:{
      type: String,
      required: true
    },
    state:{
      type: String,
      required: true
    }
  },

  mobileNumber:{
    type: String, 
    required: true
  },

  paymentType:{
    type: String,
    enum: ["COD", "UPI", "NET BANKING"],
    required: true,
  },
  
  paymentStatus: {
    type: String,
    enum: ["UNPAID", "PAID"],
    default: "UNPAID"
  }
}, { timestamps: true });

export const Cart = mongoose.model("Cart", cartSchema);
export const Order = mongoose.model("Order", orderSchema);