# Compliance Settings API Testing Guide

This document outlines the endpoints, request formats, and expected responses for the Compliance Settings module (Module 13).

**Base URL:** `http://localhost:5000/api/v1`
**Auth Header:** `Authorization: Bearer <token>`

---

## ─── FINANCIAL YEARS ───

### 1. Get All Financial Years
- **Endpoint:** `GET http://localhost:5000/api/v1/financial-years`
- **Method:** `GET`
- **Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": [
    { "_id": "...", "financialYear": "2025-2026" },
    { "_id": "...", "financialYear": "2024-2025" }
  ],
  "message": "Financial years fetched",
  "success": true
}
```

### 2. Create Financial Year
- **Endpoint:** `POST http://localhost:5000/api/v1/financial-years`
- **Method:** `POST`
- **Body:**
```json
{ "year": "2026-2027" }
```

### 3. Update Financial Year
- **Endpoint:** `PUT http://localhost:5000/api/v1/financial-years/:id`
- **Method:** `PUT`
- **Body:**
```json
{ "year": "2025-2026" }
```

---

## ─── COMPLIANCE SETTINGS ───

### 1. Get Compliance Settings (by Year)
- **Endpoint:** `GET http://localhost:5000/api/v1/compliance-settings`
- **Method:** `GET`
- **Query Params:** `?year=2025-2026`
- **Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "69bd0f12b474a2c8a7320714",
      "name": "Preparation & Filing of Form ADT-01 (Auditor Appointment)",
      "financialYear": "2025-2026",
      "hasExpiry": true,
      "forNewCompany": true,
      "daysOfExpiry": 30,
      "expiryTemplate": { "_id": "...", "name": "Compliance Update" }
    }
  ],
  "message": "Compliance settings fetched",
  "success": true
}
```

### 2. Create Compliance Setting
- **Endpoint:** `POST http://localhost:5000/api/v1/compliance-settings`
- **Method:** `POST`
- **Body:**
```json
{
  "name": "Preparation & Filing of Form INC - 20A",
  "year": "2025-2026",
  "hasExpiry": true,
  "daysOfExpiry": 180,
  "inc20": true,
  "expiryTemplateId": "69c21b09446d88bc64161b68"
}
```

### 3. Update Compliance Setting
- **Endpoint:** `PUT http://localhost:5000/api/v1/compliance-settings/:id`
- **Method:** `PUT`
- **Body:**
```json
{
  "daysOfExpiry": 150
}
```

### 4. Delete Compliance Setting
- **Endpoint:** `DELETE http://localhost:5000/api/v1/compliance-settings/:id`
```json
{ "message": "Compliance setting deleted" }
```
