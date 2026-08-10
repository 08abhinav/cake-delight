import express from "express"
import {authorizedUser}  from "../middleware/authorizedUser.js"
import { handleAverageRating, handleRating, handleRatingDisplay } from "../controllers/ratingController.js";

const ratingRoutes = express.Router();

ratingRoutes.get('/order/:productId', handleRatingDisplay);
ratingRoutes.post('/order', authorizedUser(), handleRating);

ratingRoutes.get('/order/average/:productId', handleAverageRating);

export default ratingRoutes;