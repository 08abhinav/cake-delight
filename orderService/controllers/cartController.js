import "dotenv/config";
import axios from "axios";
import { Cart } from "../models/schema.js";

export const handleCartInsertion = async (req, res, next) => {
  try {
    const { _id: userId, email: userEmail } = req.user;

    const { productId, quantity } = req.body;

    let product;

    try {
      const response = await axios.get(`${process.env.CAKE_SVC_URL}/api/cake/${productId}`);
      product = response.data.data;

    } catch (err) {
      if (err.response?.status === 404) {
        return res.status(404).json({
          success: false,
          message: "Product does not exist."
        });
      }

      return res.status(503).json({
        success: false,
        message: "Product service is currently unavailable."
      });
    }

    const item = {
      productId: product._id,
      productName: product.name,
      price: product.price,
      quantity,
      estimatedDeliveryTime: product.estimatedDeliveryTime
    };

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      if (product.availability < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.availability} items remaining`
        });
      }

      cart = new Cart({
        userId,
        userEmail,
        items: [item]
      });

    } else {
      const itemExist = cart.items.findIndex((i) => String(i.productId) === String(productId));

      if (itemExist > -1) {
        const newQuantity = cart.items[itemExist].quantity + quantity;

        if (newQuantity > product.availability) {
          return res.status(400).json({
            success: false,
            message: `Only ${product.availability} items remaining`
          });
        }

        cart.items[itemExist].quantity = newQuantity;
        cart.items[itemExist].price = product.price;

      } else {
        if (quantity > product.availability) {
          return res.status(400).json({
            success: false,
            message: `Only ${product.availability} items remaining`
          });
        }
        cart.items.push(item);
      }
    }

    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Item added to cart",
      cart
    });

  } catch (err) {
    next(err);
  }
};

export const handleCartDisplay = async(req, res, next)=>{
    try{
        const {_id: userId, email: userEmail} = req.user;

        let cart = await Cart.findOne({userId})
        if(!cart){
            return res.status(200).json({success: true, message: "cart is empty"})
        }

        return res.status(200).json({success: true, data: cart})
    }catch(err){

    }
}

export const handleCartUpdation = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    // todo body validator
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found."
      });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart."
      });
    }

    if (quantity > 0) {
        let product;
        try{
            const response = await axios.get(`${process.env.CAKE_SVC_URL}/api/cake/${productId}`)
            product = response.data.data;
        }catch(err){
            if (err.response && err.response.status === 404) {
                return res.status(404).json({
                success: false,
                message: "Product does not exist.",
                });
            }
            return res.status(503).json({
                success: false,
                message: "Product service is currently unavailable.",
            });
        }
        if(product.availability < quantity){
            return res.status(400).json({message: `Only ${product.availability} items remaining`})
        }else{
            cart.items[itemIndex].quantity = quantity;
        }
    } else {
      cart.items.splice(itemIndex, 1);
      if(cart.items.length === 0){
        await Cart.deleteMany({})
        return res.status(200).json({
            success: true,
            message: "Cart is empty"
        })
      }
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully.",
      data: cart
    });

  } catch (err) {
    next(err);
  }
};