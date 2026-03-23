# Accountant Jobs API Testing Document

This document outlines the endpoints, request expectations, and authentic JSON responses for the Accountant Jobs API (Module 11).

**Important:** All routes are protected and require the `Authorization: Bearer <token>` header containing a valid user/agent JWT. Actions like create/update/delete usually require `admin` or `agent`/`accountant` roles.

## 1. Get All Jobs
- **Endpoint:** `GET http://localhost:5000/api/v1/jobs`
- **Method:** `GET`
- **Query Parameters:** Optional (e.g., `?status=To Be Done`, `?customer=<id>`, `?accountant=Samrat`)
- **Expected Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "69be63c665318a93c8da5946",
        "customer": {
          "_id": "69bcf4fb3b2c2f7ac07dd287",
          "name": "Raj Mishra",
          "phone": "9999988888",
          "companyName": "Raj Innovations Pvt Ltd",
          "emails": []
        },
        "jobTitle": "Complete Q3 GST Filing",
        "status": "To Be Done",
        "hasExpiry": true,
        "expiryDate": "2026-03-22T09:24:22.477Z",
        "createdAt": "2026-03-21T09:24:22.484Z",
        "updatedAt": "2026-03-21T09:24:22.484Z",
        "__v": 0
      }
    ],
    "message": "Jobs retrieved successfully",
    "success": true
  }
  ```

## 2. Create Job
- **Endpoint:** `POST http://localhost:5000/api/v1/jobs`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "jobTitle": "Complete Q3 GST Filing",
    "customer": "69bcf4fb3b2c2f7ac07dd287",
    "status": "To Be Done",
    "hasExpiry": true,
    "expiryDate": "2026-03-22T09:24:22.477Z"
  }
  ```
- **Expected Response (201 Created):**
  ```json
  {
    "statusCode": 201,
    "data": {
      "customer": "69bcf4fb3b2c2f7ac07dd287",
      "jobTitle": "Complete Q3 GST Filing",
      "status": "To Be Done",
      "hasExpiry": true,
      "expiryDate": "2026-03-22T09:24:22.477Z",
      "_id": "69be63c665318a93c8da5946",
      "createdAt": "2026-03-21T09:24:22.484Z",
      "updatedAt": "2026-03-21T09:24:22.484Z",
      "__v": 0
    },
    "message": "Job created successfully",
    "success": true
  }
  ```

## 3. Update Job
- **Endpoint:** `PUT http://localhost:5000/api/v1/jobs/:id`
- **Method:** `PUT`
- **Request Body:**
  ```json
  {
    "status": "Ongoing",
    "accountant": "Tapas"
  }
  ```
- **Expected Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "69be63c665318a93c8da5946",
      "customer": {
        "_id": "69bcf4fb3b2c2f7ac07dd287",
        "name": "Raj Mishra",
        "phone": "9999988888",
        "companyName": "Raj Innovations Pvt Ltd",
        "emails": []
      },
      "jobTitle": "Complete Q3 GST Filing",
      "status": "Ongoing",
      "hasExpiry": true,
      "expiryDate": "2026-03-22T09:24:22.477Z",
      "createdAt": "2026-03-21T09:24:22.484Z",
      "updatedAt": "2026-03-21T09:24:22.751Z",
      "__v": 0,
      "accountant": "Tapas"
    },
    "message": "Job updated successfully",
    "success": true
  }
  ```

## 4. Delete Job
- **Endpoint:** `DELETE http://localhost:5000/api/v1/jobs/:id`
- **Method:** `DELETE`
- **Expected Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": null,
    "message": "Job deleted successfully",
    "success": true
  }
  ```
