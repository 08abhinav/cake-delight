# Cake Delight

Cake Delight is a capstone project which focuses on developing a cloud-native microservices application.

## Overview

The application is built on a microservices-based architecture designed to deliver an end-to-end e-commerce experience for customers. It covers the full user journey, allowing customers to:

- Browse Products: Explore a variety of cake products.
- Filter & Search: Apply filters to easily find specific cakes.
- Manage Basket: Add cakes to the shopping basket and adjust quantities or items.
- Checkout & Payment: Seamlessly place orders and complete the checkout process.
- Notifications: Receive automated order confirmation notifications.
- Ratings & Reviews: Rate and review cakes after purchase.

---

## Architecture & Service Breakdown

### Frontend

- Technology: React.js, Vite, Nginx
- Overivew: Handles the user interface and connecting to backend microservices via the API Gateway to deliver a Fast and Smooth experience.

### API Gateway: 

- Technology: Express Gateway
- Overview: Servers a single entry point for all incoming external client requests. 
- Why I choose this specific API Gateway? 
Express's greatest strength is simplicity and flexibility, it means a minimalist, general purpose framework that is familiar to every Node developer.

```plaintext
| Public endpoints | Target Service | Port |
|                  |                |      |
| /api/user/*      | user service   | 3000 | 
| /api/cake/*      | cake service   | 3001 | 
| /api/cart/*      | order service  | 3002 | 
| /api/order/*     | order service  | 3002 | 
| /api/rating/*    | rating service | 3003 | 

```

---

### User Service: 

- Overview: Manages user authentication, authorization and role-based access control.
- Key feature: Ensures clear segmentation between user roles, for example: Buyers can browse cakes and make purchase, while Sellers are authorized to manage thier bakery profile and list new cakes.
- Explore more about user service **[visit here](userSerivce/README.md)**.

---

### Cake Catalog: 

- Overview: Manages cake listings, categories, and search filters (by name, category, or price range), Sellers have extended privileges to create, update, and delete their cake listings.
- Explore more about cake catalog service **[visit here](cakeCatalog/README.md)**

---

### Cart & Order service: 

- Overview: Manages user shopping carts and order processing, Maintains isolated, persistent cart states for individual buyers and handles the transition from cart checkout to order creation.
- Explore more about cart and order service **[visit here](orderService/README.md)**

---

### Rating service: 

- Overview: Handles customer reviews and ratings for purchased cake, Aggregates user feedback and syncs updated scores back to the Cake Catalog Service.
- Explore moer about rating service **[visit here](ratingService/README.md)**

---

### Notification service: 

- Overview: Sends order updates and confirmation messages to buyers upon successful checkout.
- Explore more about notification service **[visit here](notificationService/READE.md)**

---

### Architecture Diagram
- To view the full system flow and component interactions, check out the **[OverallArchitecture](ArchitectureDiagram/OverallArchitecture.png)**.

---

## Tech Stack

```plaintext
| Service           | Technology                                                |
|                   |                                                           |
| Frontend          | React.js, vite                                            |
| Backend           | Node.js, Express.js                                       |
| Database          | MongoDB                                                   |
| Messaging         | Kafka                                                     |
| External Services | Cloudinary (image uploading), Brevo (email notificiation) |
| DevOps            | Docker, Docker compose, kubernetes                        |
```
---

## Key Features

1. Loosely Coupled Services: Built using an independent microservices architecture, ensuring each service can be developed, deployed, and scaled without impacting the rest of the system.

2. RESTful APIs: Clean, standard REST endpoints implemented across services for seamless client-to-service and service-to-service communication.

3. Event-Driven Architecture: Asynchronous event management to handle background tasks like order notifications without blocking user interactions.

4. Containerized Workloads: Every microservice is packaged into its own lightweight Docker container, ensuring consistent environments across development and production.

5. Kubernetes Orchestration: Deployed and managed using Kubernetes for automated scaling, self-healing, and container management.

---

## Local Setup using Docker & Docker compose

### Prerequisites
- Docker and Docker Compose installed on your machine.

### Step 1: Create the Environment File
Create a .env file at the root of your project directory using touch

```bash
vim .env # if vim not installed in your system
touch .env
```

```code snippet
# MongoDB Credentials
USERNAME=<your-mongodb-username>
PASSWORD=<your-mongodb-password>

# Authentication
JWT_SECRET=<your-jwt-secret>

# Service Ports
USER_PORT=3000
CAKE_PORT=3001
ORDER_PORT=3002
RATING_PORT=3003
NOTIFY_PORT=3004

# Internal Microservice URLs
USER_URL=http://user-svc:3000
CAKE_URL=http://cake-svc:3001
ORDER_URL=http://order-svc:3002
RATING_URL=http://rating-svc:3003

# API Gateway & Message Broker
VITE_API_BASE_URL=http://gateway:8080
KAFKA_BROKER=kafka:29092

# Email Notifications (Brevo)
BREVO_API_KEY=<your-brevo-api-key>
SENDER_EMAIL=<your-sender-email>
SENDER_NAME=cakedelight

# Media Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

### Step-2: Understand the Services
The project includes a docker-compose.yaml file that configures 14 containerized services:
- 4 Database Instances: Isolated MongoDB containers for data persistence.
- 10 Application & Infrastructure Services: user-svc, cake-svc, order-svc, rating-svc, gateway, kafka, kafka-ui, kafka-svc, notification-svc, and frontend.
- Each microservice is packaged with its own Dockerfile containing all necessary dependencies.


### Step 3: Validate Your Docker Configuration

```bash
docker-compose config
```

If any warning appears adjust your .env or docker-compose.yaml file accordingly.

### Step 4: Build and Start the Application

```bash
docker-compose up --build
```
- The **--build** flag ensures Docker compiles the latest code changes for each service before launching the environment.

### Step 5: Access the Application
Once the containers are running, open your web browser and navigate to:

```plaintext
http://localhost:5173
```
You should now see the Cake Delight frontend up and running.

### Docker Architecture Overview
- To view the full system flow and component interactions, check out the **[OverallArchitecture](ArchitectureDiagram/dockerCompose.png)**.


## Kubernetes Setup
I am using minikube for deploying my applicaiton in a local kubernetes cluster.
For sake of simplicity I have created individual directory for each service manifest configuration.

To explore the kubenetes manifest file go to **[K8s](./k8s/)** inside this directory there are different directory for services, database and for kafka

### Prerequisites

```plaintext
- Docker
- minikube
- kubectl
```

```bash
docker -v
minikube version
kubectl version --client
```

### Step-1: Start the Minikube Cluster

```bash
minikube start --nodes=3 --driver=docker
```

Why I selected 3 nodes? because Running a 3-node cluster simulates high availability (HA) locally, enabling workload distribution and fault tolerance across nodes.

### Step-2: Create a namespace

```bash
kubectl apply -f namespace.yaml
```
- To verify that the namespace exists.

```bash
kubectl get namespace
```
- You should see you namespace, in our case it is dev.

### Step-3: Deploy Database Resources

**NOTE: Check manifest files prior to applying and update any blank configuration fields or placeholder strings with your credentials.**

- Navigate to each database directory (e.g., userdb, cakedb), applying secrets first:

```bash
cd userdb
kubectl apply -f secret.yaml
kubectl apply -f .
```

- Repeat this step for rest of the db manifest directory.

### Step-4: Verify Database Deployment

- Check that all pods, services, and persistent volumes in the dev namespace are running:

```bash
kubectl get all -n dev
```

### Step-5: Deploy Application Microservices

**NOTE: Before apply any manifest file go through that file because there are blank string so replace them accordingly**
Navigate to the each service directory named as user, cake, and all.

```bash
kubectl apply -f secret.yaml
kubectl apply -f .
```

- Repeat this step for every service directory
- After this repeat the **Step-4**.

```bash
kubectl get all -n dev  
```

### Step-6: Expose the Application using NGINX Ingress

- To manage external traffic and route requests to the correct services without exposing multiple ports, an NGINX Ingress Controller is used.

1. Enable the ingress addon

```bash
minikube addons enable ingress
```

- verify the addon 

```bash
kubectl get namespace
```

- You will notice a new namespace is added as ingress-nginx

```bash
kubectl get all -n ingress-nginx
```

2. Apply ingress manifest

```bash
kubectl apply -f ingress.yaml
```

3. Access the application

- Get the IP address of your Minikube cluster.

```bash
minikube ip
```

- Open your web browser and navigate to http://<MINIKUBE_IP>. You should now see the Cake Delight frontend interface.

---