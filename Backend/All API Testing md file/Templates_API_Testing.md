# Templates API Testing Document

This document outlines the endpoints, request expectations, and authentic JSON responses for the Email and WhatsApp Templates API (Module 10).

**Important:** All routes are protected and require the `Authorization: Bearer <token>` header containing a valid user/agent JWT. Modifications (POST, PUT, DELETE) require an `admin` role.

## 1. Get All Templates
- **Endpoint:** `GET http://localhost:5000/api/v1/templates`
- **Method:** `GET`
- **Query Parameters:** Optional (e.g., `?type=Email` or `?type=WhatsApp`)
- **Expected Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "69be626c67ce5450dc883db8",
        "name": "Startup India Registration",
        "subject": "Startup India Registration - Next Steps & Document Submission",
        "body": "&lt;html&gt;&lt;body&gt;<p>Here are your next steps...</p>&lt;/body&gt;&lt;/html&gt;",
        "type": "Email",
        "createdAt": "2026-03-21T09:18:36.260Z",
        "updatedAt": "2026-03-21T09:18:36.260Z",
        "__v": 0
      }
    ],
    "message": "Templates retrieved successfully",
    "success": true
  }
  ```

## 2. Create Template
- **Endpoint:** `POST http://localhost:5000/api/v1/templates`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "name": "Startup India Registration",
    "subject": "Startup India Registration - Next Steps & Document Submission",
    "body": "<html><body><p>Here are your next steps...</p></body></html>",
    "type": "Email"
  }
  ```
- **Expected Response (201 Created):**
  ```json
  {
    "statusCode": 201,
    "data": {
      "name": "Startup India Registration",
      "subject": "Startup India Registration - Next Steps & Document Submission",
      "body": "&lt;html&gt;&lt;body&gt;<p>Here are your next steps...</p>&lt;/body&gt;&lt;/html&gt;",
      "type": "Email",
      "_id": "69be626c67ce5450dc883db8",
      "createdAt": "2026-03-21T09:18:36.260Z",
      "updatedAt": "2026-03-21T09:18:36.260Z",
      "__v": 0
    },
    "message": "Template created successfully",
    "success": true
  }
  ```

## 3. Update Template
- **Endpoint:** `PUT http://localhost:5000/api/v1/templates/:id`
- **Method:** `PUT`
- **Request Body:**
  ```json
  {
    "subject": "Startup India Request - Document Submission"
  }
  ```
- **Expected Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "69be626c67ce5450dc883db8",
      "name": "Startup India Registration",
      "subject": "Startup India Request - Document Submission",
      "body": "&lt;html&gt;&lt;body&gt;<p>Here are your next steps...</p>&lt;/body&gt;&lt;/html&gt;",
      "type": "Email",
      "createdAt": "2026-03-21T09:18:36.260Z",
      "updatedAt": "2026-03-21T09:18:36.450Z",
      "__v": 0
    },
    "message": "Template updated successfully",
    "success": true
  }
  ```

## 4. Delete Template
- **Endpoint:** `DELETE http://localhost:5000/api/v1/templates/:id`
- **Method:** `DELETE`
- **Expected Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": null,
    "message": "Template deleted successfully",
    "success": true
  }
  ```
