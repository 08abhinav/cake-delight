# Notification Service

The Notification Service is an event-driven microservice responsible for handling automated email alerts and notifications across the application.

---

# Overview

The service acts as an asynchronous message consumer, decoupling background tasks (such as sending emails) from main core services like Checkout and Order processing. Here is a breakdown of how it works:

### Event-Driven Messaging (Kafka)

- Listens to the order-placed-successfully Kafka topic.
- Consumes order placement events emitted by downstream microservices asynchronously.

### Email Notifications (Brevo Integration)

- Parses transaction payloads (order items, total amount, delivery estimate, and payment details).
- Triggers transactional order confirmation emails directly to customer inboxes via Brevo (sendOrderConfirmation).

### System Health Monitoring

- Exposes a root REST health-check endpoint (GET /) to confirm service availability inside container orchestration platforms (like Docker or Kubernetes).

---

# Technical Stack

- Runtime: Node.js (Express.js)
- Message Broker: Apache Kafka 
- Email Service Provider: Brevo 
- Configuration: Express, Body-Parser, dotenv

---

# Kafka Event Subscriptions

- Consumer Details
- Client ID: Notification-svc
- Consumer Group: notify-service
- Subscribed Topic: order-placed-successfully
- When an order is successfully created, the service consumes a message with the following JSON schema:

```json
{
  "userEmail": "john@example.com",
  "items": [
    {
      "cakeId": "60d5ec49f1b2c81184a2b25c",
      "name": "Chocolate Truffle Cake",
      "quantity": 1,
      "price": 25.00
    }
  ],
  "totalAmount": 25.00,
  "estimatedDeliveryTime": "2026-08-15T18:00:00Z",
  "paymentStatus": "COMPLETED",
  "paymentType": "CREDIT_CARD"
}
```

### Event Handler Flow:

- Receives message from partition.
- Deserializes the message payload string to JSON.
- Invokes sendOrderConfirmation() to construct and send the formatted email via Brevo.

---

# Environment Variables

```code snippet
PORT=3004
KAFKA_BROKER=kafka:29092
BREVO_API_KEY=<your-brevo-api-key>
SENDER_EMAIL=<your-sender-email>
SENDER_NAME=cakedelight
```

----