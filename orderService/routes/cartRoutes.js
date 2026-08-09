import express from "express"
import {authorizedUser} from "../middleware/authorized.js"
import { handleCartDisplay, handleCartInsertion, handleCartUpdation } from "../controllers/cartController.js";

const cartRoutes = express.Router();
cartRoutes.use(authorizedUser());

cartRoutes.get("/items", handleCartDisplay);
cartRoutes.post("/items", handleCartInsertion);

cartRoutes.put("/items", handleCartUpdation);

export default cartRoutes;  