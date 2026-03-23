# Logout API Testing Document

This document details the endpoint and response for the Logout API (Module 15).

**Important:** The `logout` endpoint requires the `Authorization: Bearer <token>` header containing a valid user/agent/customer JWT.

## 1. Logout User / Agent / Customer
- **Endpoint:** `POST http://localhost:5000/api/v1/auth/logout`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <accessToken>`
- **Expected Payload:** None
- **Expected Action:**
  - The server verifies the token.
  - Generates HTTP responses instructing the client browser to immediately expire the `accessToken` and `refreshToken` HttpOnly cookies (sets `Expires` to a past date).
  - For non-customers, the server also unsets the `refreshToken` physically from the MongoDB `Users` collection.

- **Expected Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": null,
    "message": "Logged out successfully",
    "success": true
  }
  ```

- **Set-Cookie Headers Received (Example):**
  ```http
  Set-Cookie: accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly
  Set-Cookie: refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly
  ```
