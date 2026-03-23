# Users API Testing Document

This document outlines the endpoints, request expectations, and authentic JSON responses for the Users API (Module 12) used to manage staff access.

**Important:** All routes are protected and require the `Authorization: Bearer <token>` header containing a valid user/agent JWT. Actions like create/update/delete require an `admin` role.

## 1. Get All Users (Staff List)
- **Endpoint:** `GET http://localhost:5000/api/v1/users`
- **Method:** `GET`
- **Query Parameters:** Optional (e.g., `?role=agent`, `?role=accountant`, `?active=true`)
- **Expected Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": [
      {
        "_id": "69be641cd5a20e6786c4e2df",
        "name": "New Agent User",
        "email": "agent@startupstation.in",
        "role": "agent",
        "active": true,
        "deletedAt": null,
        "createdAt": "2026-03-21T09:25:48.013Z",
        "updatedAt": "2026-03-21T09:25:48.013Z",
        "__v": 0
      }
    ],
    "message": "Users retrieved successfully",
    "success": true
  }
  ```

## 2. Create User (Agent/Accountant)
- **Endpoint:** `POST http://localhost:5000/api/v1/users`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "name": "New Agent User",
    "email": "agent@startupstation.in",
    "password": "securepassword",
    "role": "agent"
  }
  ```
- **Expected Response (201 Created):**
  ```json
  {
    "statusCode": 201,
    "data": {
      "name": "New Agent User",
      "email": "agent@startupstation.in",
      "role": "agent",
      "active": true,
      "deletedAt": null,
      "_id": "69be641cd5a20e6786c4e2df",
      "createdAt": "2026-03-21T09:25:48.013Z",
      "updatedAt": "2026-03-21T09:25:48.013Z",
      "__v": 0
    },
    "message": "User created successfully",
    "success": true
  }
  ```

## 3. Update User Status/Role
- **Endpoint:** `PUT http://localhost:5000/api/v1/users/:id`
- **Method:** `PUT`
- **Request Body:**
  ```json
  {
    "active": false
  }
  ```
- **Expected Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "69be641cd5a20e6786c4e2df",
      "name": "New Agent User",
      "email": "agent@startupstation.in",
      "role": "agent",
      "active": false,
      "deletedAt": null,
      "createdAt": "2026-03-21T09:25:48.013Z",
      "updatedAt": "2026-03-21T09:25:48.828Z",
      "__v": 0
    },
    "message": "User updated successfully",
    "success": true
  }
  ```

## 4. Delete User (Soft Delete)
- **Endpoint:** `DELETE http://localhost:5000/api/v1/users/:id`
- **Method:** `DELETE`
- **Expected Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": null,
    "message": "User soft-deleted successfully",
    "success": true
  }
  ```
