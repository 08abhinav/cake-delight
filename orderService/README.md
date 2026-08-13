# Cart & Order Service

The Cart & Order Service manages shopping cart state, order processing, inventory synchronization, and event-driven notifications for the application.

---

# Technical Stack

- Runtime: Node.js (Express.js)
- Authentication & Authorization: JWT webtokens
- Database: MongoDB
- Message broker: Kafka (Kafkajs)

---

# Overview

This microservice handles the complete lifecycle of customer shopping carts and order checkouts. Here is a breakdown of how it works:

### Cart Management

- Item Insertion & Validation: When a user adds an item to the cart, the service communicates with the Cake Service (CAKE_SVC_URL) to verify item existence, fetch current pricing, and check inventory stock.
- Stock Checks: Rejects additions if requested quantities exceed available product stock.
- Cart Updates & Deletion: Users can modify item quantities. Setting quantity to 0 removes the item. If the cart becomes empty, the cart record is cleaned up automatically.

### Checkout & Payment Processing

- Validation & Rules: Validates address details and payment methods.
    - Online payments (UPI, NET BANKING) require a PAID status.
    - Cash-on-delivery (COD) requires an UNPAID status.
- Estimated Delivery Calculation: Determines total delivery time based on the highest estimated delivery duration among all cart items.
- Inventory Deduction: Upon order placement, the service issues requests to the Cake Service to reduce stock levels for each purchased item.

### Kafka Event Publishing

- Order Notification Events: Once an order is placed, the service publishes an order-placed-successfully event to Kafka.
- The Notification Service consumes this event asynchronously to deliver email confirmations to buyers without blocking the checkout HTTP response.

---

# API Endpoints

### Cart Endpoints

1. Get User Cart

- Endpoint: /api/cart/items
- Method: GET
- Headers: Authorization: Bearer <token>
- Success Response:

```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c81184a2b25c",
    "userId": "user123",
    "userEmail": "john@example.com",
    "items": [
      {
        "productId": "cake123",
        "productName": "Chocolate Truffle",
        "price": 25,
        "quantity": 2,
        "estimatedDeliveryTime": 2
      }
    ]
  }
}
```

2. Add Item to Cart

- Endpoint: /api/cart/items
- Method: POST
- Headers: Authorization: Bearer <token>
- Request Body:

```json
{
  "productId": "cake123",
  "quantity": 2
}
```

- Success Response:

```json
{
  "success": true,
  "message": "Item added to cart",
  "cart": { ... }
}
```

3. Update Cart Item

- Endpoint: /api/cart/items
- Method: PUT
- Headers: Authorization: Bearer <token>
- Request Body:

```json
{
  "productId": "cake123",
  "quantity": 3
}
```

- success response:

```json
{
  "success": true,
  "message": "Cart updated successfully.",
  "data": { ... }
}
```

### Order Endpoints

4. Get User Orders

- Endpoint: /api/order/checkout
- Method: GET
- Headers: Authorization: Bearer <token>
- Success Response:

```json
{
  "success": true,
  "message": "order detials",
  "data": [
    {
      "_id": "order678",
      "userId": "user123",
      "items": [ ... ],
      "totalAmount": 50,
      "estimatedDeliveryTime": "2026-08-13T16:00:00.000Z",
      "paymentType": "COD",
      "paymentStatus": "UNPAID"
    }
  ]
}
```

5. Checkout / Place Order

- Endpoint: /api/order/checkout
- Method: POST
- Headers: Authorization: Bearer <token>
- Request Body:

```json
{
  "houseno": "123",
  "street": "Baker Street",
  "city": "London",
  "pincode": "110001",
  "state": "Central",
  "mobileNumber": "9876543210",
  "paymentType": "COD",
  "paymentStatus": "UNPAID"
}
```

- success response

```json
{
  "success": true,
  "message": "order place",
  "data": {
    "_id": "order678",
    "userEmail": "john@example.com",
    "totalAmount": 50,
    "paymentStatus": "UNPAID"
  }
}
```

---

# Environment Variables

```code snippet
PORT=3002
JWT_SECRET=<change-with-your-env>
MONGO_URL=<change-with-your-env>
CAKE_SVC_URL=http://localhost:3001 
KAFKA_BROKER=localhost:9092
```