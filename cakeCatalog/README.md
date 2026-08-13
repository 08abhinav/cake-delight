# Cake Catalog Service

The Cake Catalog Service manages the core product catalog for the application, handling cake listings, media uploads, inventory availability, search, and seller management.

---

# Technical Stack

- Runtime: Node.js (Express.js)
- Authentication & Authorization: JWT webtokens
- Database: MongoDB

---

# Overview

This microservice provides endpoints for buyers to browse and search products, as well as operational controls for sellers to manage their cake inventory. Below is a breakdown of its primary responsibilities:

### Product Creation & Cloudinary Integration
- Sellers can list new cakes by supplying product details such as name, description, category, price, inventory count, and estimated delivery time.
- Image uploads are processed via a direct memory stream to Cloudinary (cake-delight/cakes folder), storing the resulting secure URL in MongoDB.
- Prevents duplicate entries per user by checking for existing cake names linked to the seller's account.


### Product Search, Filtering, & Catalog Display
- In-Stock Catalog: Allows users to view all available cakes (availability > 0).
- Dynamic Search & Filtering: Offers flexible filtering based on partial name matching, category, and price ranges (minPrice, maxPrice).
- Product Details: Provides single-product retrieval by ID for direct product pages.


### Inventory Management & Stock Adjustment
- Enables real-time inventory decrements when orders are placed, ensuring atomicity using MongoDB condition checks (availability >= quantity).
- Sellers can view, update, and delete their own cake listings (handleMyCakes, handleEntryUpdation, handleEntryDeletion).

---

# API Endpoints

1. Create Cake Entry

- Endpoint: /api/cake/addCake
- Method: POST
- Headers: Authorization: Bearer <token>
- Content-Type: multipart/form-data
- Request Body:

```json
{    
    "name": "Chocolate Fudge Cake",
    "description": "Rich dark chocolate cake with chocolate ganache.",
    "category": "Chocolate",
    "price": 2599,
    "availability": 10,
    "estimatedDeliveryTime": "24 hours",
    "image": [Binary Image File]
}
```

- Success Response:

```json
{
  "success": true,
  "message": "entry saved"
}
```

- Error Response:

```json
{
  "success": false,
  "message": "Entry already exist"
}
```

2. Get Available Cakes

- Endpoint: /api/cake/allCake
- Method: GET
- Description: Retrieves all cakes with availability > 0.
- Success Response (200 OK):

```json
{
  "success": true,
  "data": [
    {
      "_id": "651a2b3c4d5e6f7a8b9c0d1e",
      "name": "Chocolate Fudge Cake",
      "description": "Rich dark chocolate cake with chocolate ganache.",
      "category": "Chocolate",
      "price": 2599,
      "availability": 10,
      "estimatedDeliveryTime": "24 hours",
      "image": "https://res.cloudinary.com/demo/image/upload/v12345678/cake-delight/cakes/sample.jpg",
      "user": "60d5ec49f1b2c81184a2b25c"
    }
  ]
}
```

3. Get Cake by ID

- Endpoint: /api/cake/:id
- Method: GET
- Success Response (200 OK):

```json
{
  "success": true,
  "data": {
    "_id": "651a2b3c4d5e6f7a8b9c0d1e",
    "name": "Chocolate Fudge Cake",
    "description": "Rich dark chocolate cake with chocolate ganache.",
    "category": "Chocolate",
    "price": 2599,
    "availability": 10,
    "estimatedDeliveryTime": "24 hours",
    "image": "https://res.cloudinary.com/demo/image/upload/v12345678/cake-delight/cakes/sample.jpg",
    "user": "60d5ec49f1b2c81184a2b25c"
  }
}
```

4. Filter Cakes

- Endpoint: /api/cake/filter
- Method: GET
- Query Parameters: name (string), category (string), minPrice (number), maxPrice (number)
- Example Request: /api/cake/search?category=chocolate&minPrice=10&maxPrice=30
- Success Response (200 OK):

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "651a2b3c4d5e6f7a8b9c0d1e",
      "name": "Chocolate Fudge Cake",
      "category": "Chocolate",
      "price": 299
    }
  ]
}
```

5. Get Seller's Cakes ("My Cakes")

- Endpoint: /api/cake/myCakes
- Method: GET
- Headers: Authorization: Bearer <token>
- Success Response (200 OK):

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "651a2b3c4d5e6f7a8b9c0d1e",
      "name": "Chocolate Fudge Cake",
      "price": 25.99,
      "availability": 10
    }
  ]
}
```

6. Update Cake Entry

- Endpoint: /api/cake/updateEntry/:id
- Method: PUT
- Headers: Authorization: Bearer <token>
- Request Body:

```json
{
  "name": "Updated Chocolate Fudge Cake",
  "description": "Extra chocolate frosting included.",
  "category": "Chocolate",
  "price": 27.99,
  "availability": 15,
  "estimatedDeliveryTime": "12 hours",
  "image": "https://res.cloudinary.com/demo/image/upload/v12345678/cake-delight/cakes/sample.jpg"
}
```

- Success Response (200 OK):

```json
{
  "success": true,
  "message": "entry updated",
  "updatedData": {
    "_id": "651a2b3c4d5e6f7a8b9c0d1e",
    "name": "Updated Chocolate Fudge Cake",
    "price": 2799
  }
}
```

7. Delete Cake Entry

- Endpoint: /api/cake/deleteEntry/:id
- Method: DELETE
- Headers: Authorization: Bearer <token>
- Success Response (200 OK):

```json
{
  "success": true,
  "message": "entry deleted"
}
```

---

# Environment Variables

```code snippet
PROT=3001
MONGO_URL=<change-with-your-env>
JWT_SECRET=<change-with-your-env>

CLOUDINARY_CLOUD_NAME=<change-with-your-env>
CLOUDINARY_API_KEY=<change-with-your-env>
CLOUDINARY_API_SECRET=<change-with-your-env>

CLOUDINARY_API_ENV_VARIABLE=<change-with-your-env>
```