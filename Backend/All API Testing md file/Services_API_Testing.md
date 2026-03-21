# Services API Testing Document

This document outlines the real working endpoints, request expectations, and authentic JSON responses for the Services API (Module 4) to assist in frontend integration.

**Important:** All routes are protected and require the `Authorization: Bearer <token>` header containing a valid user/agent JWT. 

## 1. Get All Services
- **Endpoint:** `GET http://localhost:5000/api/v1/services`
- **Method:** `GET`
- **Expected Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "69be61934ed6ba52fb4e6ba1",
        "name": "Startup India Registration",
        "status": true,
        "professionalFees": 1500,
        "govtFees": 0,
        "hsn": "998399",
        "createdAt": "2026-03-21T09:14:59.333Z",
        "updatedAt": "2026-03-21T09:14:59.333Z",
        "__v": 0
      }
    ],
    "message": "Services retrieved successfully",
    "success": true
  }
  ```

## 2. Create Service
- **Endpoint:** `POST http://localhost:5000/api/v1/services`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "name": "Startup India Registration",
    "professionalFees": 1500,
    "govtFees": 0,
    "hsn": "998399"
  }
  ```
- **Expected Response (201 Created):**
  ```json
  {
    "statusCode": 201,
    "data": {
      "name": "Startup India Registration",
      "status": true,
      "professionalFees": 1500,
      "govtFees": 0,
      "hsn": "998399",
      "_id": "69be61934ed6ba52fb4e6ba1",
      "createdAt": "2026-03-21T09:14:59.333Z",
      "updatedAt": "2026-03-21T09:14:59.333Z",
      "__v": 0
    },
    "message": "Service created successfully",
    "success": true
  }
  ```

## 3. Update Service
- **Endpoint:** `PUT http://localhost:5000/api/v1/services/:id`
- **Method:** `PUT`
- **Request Body:**
  ```json
  {
    "professionalFees": 2999
  }
  ```
- **Expected Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "69be61934ed6ba52fb4e6ba1",
      "name": "Startup India Registration",
      "status": true,
      "professionalFees": 2999,
      "govtFees": 0,
      "hsn": "998399",
      "createdAt": "2026-03-21T09:14:59.333Z",
      "updatedAt": "2026-03-21T09:14:59.523Z",
      "__v": 0
    },
    "message": "Service updated successfully",
    "success": true
  }
  ```

## 4. Delete Service
- **Endpoint:** `DELETE http://localhost:5000/api/v1/services/:id`
- **Method:** `DELETE`
- **Expected Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": null,
    "message": "Service deleted successfully",
    "success": true
  }
  ```
