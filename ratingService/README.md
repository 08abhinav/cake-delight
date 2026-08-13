# Rating Service

The Rating Service handles product ratings and reviews submitted by authenticated users across the application.

---

# Technical Stack

- Runtime: Node.js (Express.js)
- Authentication & Authorization: JWT webtokens
- Database: MongoDB

---

# Overview

The service enables customers to rate products they have purchased and provides endpoints to retrieve rating metrics. Here is a breakdown of how it works:

### Verified Purchase Check

- Before accepting a rating, the service verifies that the user has actually purchased the cake by making an internal call to the Order Service (ORDER_SVC_URL).
- If no matching purchase history is found for the given productId, the rating submission is rejected.

### Rating Creation & Updates

- Users can rate cakes they have bought.
- If a user has already rated a specific product, their existing rating score is updated rather than creating a duplicate entry.

### Aggregation & Metrics

- Publicly accessible endpoints calculate total rating counts and compute the average star rating (rounded to one decimal place) for any individual cake product.

---

# API Endpoints

1. Submit or Update Product Rating

- Verifies user purchase status via the Order Service and records/updates the star rating for a product.
- Endpoint: /api/rating/order
- Method: POST
- Headers: Authorization: Bearer <token> or Cookie-based auth
- Request Body:

```json
{
  "productId": "60d5ec49f1b2c81184a2b25c",
  "rating": 5
}
```

- success response:

```json
{
  "success": true,
  "message": "Thank you for rating the product",
  "data": {
    "_id": "60d5ec49f1b2c81184a2b25d",
    "userId": "60d5ec49f1b2c81184a2b25c",
    "items": [
      {
        "productId": "60d5ec49f1b2c81184a2b25c",
        "productName": "Chocolate Fudge Cake",
        "rating": 5
      }
    ]
  }
}
```

- Error Response (Unpurchased Product):

```json
{
  "success": false,
  "message": "You have not purchased this product yet"
}
```

2. Get Ratings for a Product

- Retrieves all recorded user rating entries for a specific cake product ID.
- Endpoint: /api/rating/order/:productId
- Method: GET
- Success Response: 200 OK

```json
{
  "success": true,
  "data": [
    {
      "productId": "60d5ec49f1b2c81184a2b25c",
      "productName": "Chocolate Fudge Cake",
      "rating": 5
    }
  ]
}
```

3. Get Average Rating for a Product

- alculates and returns the aggregated average rating and total review count for a specific cake product.
- Endpoint: /api/rating/order/average/:productId
- Method: GET
- Success Response:

```json
{
  "success": true,
  "productId": "60d5ec49f1b2c81184a2b25c",
  "totalRatings": 12,
  "averageRating": 4.8
}
```

- Error Response (No Ratings Yet)

```json
{
  "success": false,
  "message": "No ratings found for this product"
}
```

---

# Environment Variables

```code snippet
PROT=3003
MONGO_URL=<change-with-your-env>
JWT_SECRET=<change-with-your-env>
ORDER_SVC_URL=http://localhost:3002
```

---