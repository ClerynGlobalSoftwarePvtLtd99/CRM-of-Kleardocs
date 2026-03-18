# Kleardocs CRM - Authentication API Testing Guide
*(For Postman, Requestly, or Thunder Client)*

This guide provides the exact payloads and configurations needed to test the authentication system recently built.

## Base URL
**Local Environment:** `http://localhost:5000/api/v1/auth`

---

## 1. Register a New User

**Endpoint:** `POST /register`
**Full URL:** `http://localhost:5000/api/v1/auth/register`
**Headers:** 
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "name": "Testing Admin",
  "email": "admin@kleardocs.com",
  "password": "securepassword123",
  "role": "admin" 
}
```
*(Valid roles: `admin`, `agent`, `accountant`, `customer`)*

**Expected Response (201 Created):**
```json
{
  "statusCode": 201,
  "data": {
    "name": "Testing Admin",
    "email": "admin@kleardocs.com",
    "role": "admin",
    "_id": "64bc7d8ef... (MongoDB ID)",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "message": "User registered successfully",
  "success": true
}
```

---

## 2. Login User

**Endpoint:** `POST /login`
**Full URL:** `http://localhost:5000/api/v1/auth/login`
**Headers:** 
- `Content-Type: application/json`

**Body (raw JSON):**
```json
{
  "email": "admin@kleardocs.com",
  "password": "securepassword123"
}
```

**Expected Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "name": "Testing Admin",
      "email": "admin@kleardocs.com",
      "role": "admin",
      "_id": "64bc7d8ef..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5..."
  },
  "message": "User logged in successfully",
  "success": true
}
```

**Important Testing Details:**
1. Check your Postman/Browser **Cookies** tab after a successful login. You should see a cookie named `token` that has the `HttpOnly` flag marked `true`.
2. This means you do **not** need to manually copy-paste the token for future API calls in the browser; the browser will auto-attach the cookie for protected routes.

---

## 3. Testing Global Error Handler / Validations

You can intentionally trigger the new error handler using these intentional bad requests:

#### Send Invalid Data (Tests Zod Validation):
```json
{
  "email": "invalid-email",
  "password": "123" // Too short
}
```
**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "code": "invalid_string", "message": "Invalid email", "path": ["email"] },
    { "code": "too_small", "message": "String must contain at least 6 character(s)", "path": ["password"] }
  ]
}
```

#### Register Duplicate Email (Tests MongoDB Error Handling):
Try calling `/register` twice with the exact same email.
**Expected Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "User with this email already exists",
  "errors": []
}
```
