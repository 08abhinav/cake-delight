import express from "express";
import { authorizedSeller } from "../middleware/auth.js";
import upload  from "../middleware/upload.js";
import { cakeEntryValidation } from "../lib/validations.js";
import { handleCakeAvailability, handleCakeById, handleCakeDisplay, handleCakeEntry, 
handleCakeFilter, handleEntryDeletion, handleEntryUpdation, 
handleMyCakes} from "../controllers/cakeController.js";

const cakeRoutes = express.Router();

cakeRoutes.get("/allCake", handleCakeDisplay);
cakeRoutes.get("/myCakes", authorizedSeller(), handleMyCakes);

cakeRoutes.get("/filter", handleCakeFilter);
cakeRoutes.get("/:id", handleCakeById);

cakeRoutes.post("/addCake", authorizedSeller(),  upload.single("image"),cakeEntryValidation(), handleCakeEntry);

cakeRoutes.put("/updateEntry/:id", authorizedSeller(), cakeEntryValidation(), handleEntryUpdation);
cakeRoutes.delete("/deleteEntry/:id", authorizedSeller(), handleEntryDeletion);
cakeRoutes.patch("/updateAvailability/:productId", handleCakeAvailability);

export default cakeRoutes;