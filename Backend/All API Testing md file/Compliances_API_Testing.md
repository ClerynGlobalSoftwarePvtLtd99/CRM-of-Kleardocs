# Compliances API Testing Document

This document outlines the endpoints, request expectations, and authentic JSON responses for the Global Compliances API (Module 5).

**Important:** All routes are protected and require the `Authorization: Bearer <token>` header containing a valid user/agent JWT. 

## 1. Get All Customer Compliances
- **Endpoint:** `GET http://localhost:5000/api/v1/compliances`
- **Method:** `GET`
- **Query Parameters:** `?status=To Be Done` or `?financialYear=2025-2026`
- **Expected Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "69bd0f12b474a2c8a7320714",
        "customer": {
          "_id": "69bcf4fb3b2c2f7ac07dd287",
          "name": "Raj Mishra",
          "phone": "9999988888",
          "companyName": "Raj Innovations Pvt Ltd",
          "emails": []
        },
        "financialYear": "2025-2026",
        "name": "Preparation & Filing of Form ADT-01 (Auditor Appointment)",
        "expiryDate": "2025-03-31T00:00:00.000Z",
        "status": "Done",
        "__v": 0,
        "createdAt": "2026-03-20T09:10:42.434Z",
        "updatedAt": "2026-03-20T09:39:24.810Z",
        "accountant": "Samrat",
        "completedOn": "2026-03-20T00:00:00.000Z"
      }
    ],
    "message": "Compliances retrieved successfully",
    "success": true
  }
  ```

## 2. Update Customer Compliance Status
- **Endpoint:** `PUT http://localhost:5000/api/v1/compliances/:id`
- **Method:** `PUT`
- **Request Body:**
  ```json
  {
    "status": "Done",
    "accountant": "Samrat"
  }
  ```
- **Expected Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "69bd0f12b474a2c8a7320714",
      "customer": {
        "_id": "69bcf4fb3b2c2f7ac07dd287",
        "name": "Raj Mishra",
        "companyName": "Raj Innovations Pvt Ltd"
      },
      "financialYear": "2025-2026",
      "name": "Preparation & Filing of Form ADT-01 (Auditor Appointment)",
      "expiryDate": "2025-03-31T00:00:00.000Z",
      "status": "Done",
      "__v": 0,
      "createdAt": "2026-03-20T09:10:42.434Z",
      "updatedAt": "2026-03-21T09:17:19.837Z",
      "accountant": "Samrat",
      "completedOn": "2026-03-21T09:17:19.834Z"
    },
    "message": "Compliance updated successfully",
    "success": true
  }
  ```
