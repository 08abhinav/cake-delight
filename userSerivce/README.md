# User Service

The User Service handles user authentication and authorization across the application.

---

# Technical Stack

- Runtime: Node.js (Express.js)
- Authentication & Authorization: JWT webtokens
- Database: MongoDB

# Overview

The service manages the full user onboarding and login lifecycle. Here is a breakdown of how it works:

### Registration & Role Assignment

- Users register with their username, email, password, and role.
- By default, new accounts are assigned the buyer role.
- Users can explicitly choose the seller role during registration.

### Verification Flow (OTP via Brevo)

- Upon submitting registration details, an email containing an OTP (One-Time Password) is sent via Brevo.
- The registration process redirects the user to the /verify-otp route.
- If the OTP is verified successfully, the user is redirected to the /sign-in route.

### Email Service Fallback Handling

- If the email notification service (Brevo) is temporarily unavailable, the system grants the user temporary access for 12 hours.
- After 12 hours, the user will be prompted to complete email verification upon their next sign-in attempt.

### Session Management & JWT Token

- Once verified, users can sign in using their credentials.
- Upon successful authentication, the service generates a JSON Web Token (JWT) containing essential claims (id, email, and role).


# API Endpoints

1. Sign up

- Endpoin: /api/user/signup
- Method: POST
- Request Body:

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "buyer"
}
```

- success response

```json
{
  "success": true,
  "message": "Opt send to your email, verify yourself"
}
```

2. Verify-otp

- Endpoint: /api/user/auth/verify-otp
- Method: POST
- Request Body:

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

- success response 

```json
{
  "success": true,
  "message": "Email verified successfully!"
}
```

3. Resend OTP

- Endpoint: /api/user/auth/resend-otp
- Method: POST
- Request Body:

```json
{
  "email": "john@example.com"
}
```

- success response

```json
{
  "success": true,
  "message": "A new verification code has been sent to your email."
}
```

4. Sign In

- Endpoint: /api/user/auth/signin
- Method: POST
- Request Body:

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

- Success Response

```json
{
  "message": "user logged in",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
``` 

5. Get Current User Profile

- Endpoint: /api/user/me
- Method: GET
- Headers: Authorization: Bearer <token> or Cookie-based auth
- Success Response:

```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c81184a2b25c",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

---

# Environment Variables

```code snippet
PORT=3000
JWT_SECRET=<change-with-your-env>
MONGO_URL=<change-with-your-env>

BREVO_API_KEY=<change-with-your-env>
SENDER_EMAIL=<change-with-your-env>
SENDER_NAME=<change-with-your-env>
```