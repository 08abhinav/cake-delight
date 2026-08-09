import { Cake } from "../models/cakeSchema.js";
import{validationResult} from "express-validator"

export const handleCakeEntry = async(req, res, next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {name, description, category, price, availability, estimatedDeliveryTime, image} = req.body;
        const entry = await Cake.findOne({name, user: req.user._id});
        if(entry){
            return res.status(409).json({success: false, message: "Entry already exist"})
        }

        const cake = new Cake({name, description, category, price, availability, estimatedDeliveryTime, image, user: req.user._id})
        await cake.save();

        res.status(201).json({success: true, message: "entry saved"})
    }catch(err){
        next(err)
    }
}

export const handleCakeDisplay = async(req, res, next)=>{
    try{
        const{availability} = req.query;

        const cake = await Cake.find({
            availability: {
                $gt:0
            }
        });

        res.status(200).json({success: true, data: cake})
    }catch(err){
        next(err);
    }
}

export const handleCakeById = async(req, res, next)=>{
    try{
        const {id} = req.params;
        const product = await Cake.findById(id)

        if(!product){
            return res.status(404).json({message: "Cake not found"})
        }

        return res.status(200).json({success: true, data: product})
    }catch(err){
        next(err);
    }
}

export const handleCakeFilter = async(req, res, next)=>{
    try{
        const {name, category, minPrice, maxPrice} = req.query
        const filter = {}

        if(name){
            filter.name = {$regex: name, $options: "i"};
        }
        if(category){
            filter.category = category;
        }
        if(minPrice !== undefined || maxPrice !== undefined){
            filter.price = {}
            if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
            if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
        }

        const cakes = await Cake.find(filter);

        return res.status(200).json({success: true, cout: cakes.length, data: cakes})
    }catch(err){
        next(err);
    }
}

export const handleEntryUpdation = async(req, res, next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {id} = req.params;
        const {name, description, category, price, availability, image} = req.body;

       const updatedEntry = await Cake.findOneAndUpdate(
            { _id: id, user: req.user._id },
            { name, description, category, price, availability, image },
            { new: true, runValidators: true }
        );

        if(!updatedEntry){
            return res.status(404).json({success: false, message: "entry not found"})
        }
        return res.status(200).json({success: true, message:"entry updted", updatedData: updatedEntry})
    }catch(err){
        next(err);
    }
}

export const handleEntryDeletion = async(req, res, next)=>{
    try{
        const {id} = req.params;        
       const entry = await Cake.findOneAndDelete(
            { _id: id, user: req.user._id },
        );

        if(!entry){
            return res.status(404).json({success: false, message: "entry not found"})
        }
        return res.status(200).json({success: true, message:"entry deleted"})
    }catch(err){
        next(err);
    }
}

export const handleCakeAvailability = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cake = await Cake.findOneAndUpdate(
      {
        _id: productId,
        availability: { $gte: quantity }
      },
      {
        $inc: {
          availability: -quantity
        }
      },
      {
        new: true
      }
    );

    if (!cake) {
      return res.status(400).json({
        success: false,
        message: "Cake not found or insufficient availability"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Availability updated",
      data: cake
    });

  } catch (err) {
    next(err);
  }
};