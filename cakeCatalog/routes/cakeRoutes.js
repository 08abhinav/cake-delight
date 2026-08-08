import express from "express";
import { authorizedSeller } from "../middleware/auth.js";
import { cakeEntryValidation } from "../lib/validations.js";
import { handleCakeDisplay, handleCakeEntry, handleCakeFilter, handleEntryDeletion, 
    handleEntryUpdation } from "../controllers/cakeController.js";

const cakeRoutes = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Cake:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - category
 *         - price
 *         - user
 *       properties:
 *         _id:
 *           type: string
 *           example: 65a123456789abcdef012345
 *         name:
 *           type: string
 *           minLength: 5
 *           example: chocolate fudge cake
 *         description:
 *           type: string
 *           minLength: 10
 *           example: Rich dark chocolate layered cake with fudge icing
 *         category:
 *           type: string
 *           minLength: 5
 *           example: birthday
 *         price:
 *           type: number
 *           minimum: 1
 *           example: 25.99
 *         availability:
 *           type: integer
 *           default: 0
 *           example: 10
 *         image:
 *           type: string
 *           example: https://example.com/images/cake.jpg
 *         user:
 *           type: string
 *           description: User ID of the seller
 *           example: 65a987654321fedcba543210
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CakeInput:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - category
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           minLength: 5
 *           example: chocolate fudge cake
 *         description:
 *           type: string
 *           minLength: 10
 *           example: Rich dark chocolate layered cake with fudge icing
 *         category:
 *           type: string
 *           minLength: 5
 *           example: birthday
 *         price:
 *           type: number
 *           minimum: 1
 *           example: 25.99
 *         availability:
 *           type: integer
 *           default: 0
 *           example: 5
 *         image:
 *           type: string
 *           example: https://example.com/images/cake.jpg
 *
 *     ValidationError:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *               param:
 *                 type: string
 *               location:
 *                 type: string
 *
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @openapi
 * /cakes/addCake:
 *   post:
 *     summary: Add a new cake
 *     tags: [Cakes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CakeInput'
 *     responses:
 *       201:
 *         description: Cake successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cake'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized - Seller access required
 */
cakeRoutes.post("/addCake", authorizedSeller(), cakeEntryValidation(), handleCakeEntry);

/**
 * @openapi
 * /cakes/allCake:
 *   get:
 *     summary: Retrieve all cakes
 *     tags: [Cakes]
 *     responses:
 *       200:
 *         description: A list of all cakes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cake'
 */
cakeRoutes.get("/allCake", handleCakeDisplay);

/**
 * @openapi
 * /cakes/filter:
 *   get:
 *     summary: Filter cakes by criteria
 *     tags: [Cakes]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter cakes by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price limit
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price limit
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search by cake name
 *     responses:
 *       200:
 *         description: Filtered list of cakes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cake'
 */
cakeRoutes.get("/filter/", handleCakeFilter);

/**
 * @openapi
 * /cakes/updateEntry/{id}:
 *   put:
 *     summary: Update an existing cake entry
 *     tags: [Cakes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Cake ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CakeInput'
 *     responses:
 *       200:
 *         description: Cake entry successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cake'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Seller access required
 *       404:
 *         description: Cake not found
 */
cakeRoutes.put("/updateEntry/:id", authorizedSeller(), cakeEntryValidation(), handleEntryUpdation);

/**
 * @openapi
 * /cakes/deleteEntry/{id}:
 *   delete:
 *     summary: Delete a cake entry
 *     tags: [Cakes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The Cake ID
 *     responses:
 *       200:
 *         description: Cake entry successfully deleted
 *       401:
 *         description: Unauthorized - Seller access required
 *       404:
 *         description: Cake not found
 */
cakeRoutes.delete("/deleteEntry/:id", authorizedSeller(), handleEntryDeletion);

export default cakeRoutes;