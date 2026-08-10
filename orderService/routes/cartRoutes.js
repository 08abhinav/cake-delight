import express from "express"
import {authorizedUser} from "../middleware/authorized.js"
import { validateInputs } from "../lib/validators.js";
import { handleCartDisplay, handleCartInsertion, handleCartUpdation } from "../controllers/cartController.js";

const cartRoutes = express.Router();
cartRoutes.use(authorizedUser());

cartRoutes.get("/items", handleCartDisplay);
cartRoutes.post("/items", validateInputs(), handleCartInsertion);

cartRoutes.put("/items", validateInputs(), handleCartUpdation);

export default cartRoutes;  