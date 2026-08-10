import express from "express"
import { authorizedUser } from "../middleware/authorized.js";
import { validateOrderInputs } from "../lib/validators.js";
import { handleCheckout, handleCheckoutDisplay } from "../controllers/orderController.js";

const orderRoutes = express.Router();
orderRoutes.use(authorizedUser());

orderRoutes.get("/checkout", handleCheckoutDisplay)
orderRoutes.post("/checkout", validateOrderInputs(), handleCheckout)

export default orderRoutes;