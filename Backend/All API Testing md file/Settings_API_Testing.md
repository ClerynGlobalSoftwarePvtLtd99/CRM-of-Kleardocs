# Settings API Testing Guide

This document outlines the real API endpoints, methods, parameters, and exact responses for the Global Settings tracking and Email Logs features.

---

## 1. Global Settings APIs (Section 1)

These APIs manage the core platform settings including the Invoice sequences, From Email configurations, and default automated email template mappings.

### 1.1 Retrieve General Settings
- **Endpoint:** `GET http://localhost:5000/api/v1/settings/general`
- **Expected Real Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "invoicePrefix": "INV-24-25",
      "invoiceStartingNumber": 10835,
      "emailFromName": "Kleardocs",
      "fromEmail": "kleardocssolutions@gmail.com",
      "gstTemplate": "GST Filing",
      "ptaxTemplate": "Professional Tax",
      "startupIndiaTemplate": "Startup India Promotion",
      "inc20Template": "INC 20A Reminder",
      "recurringInvoiceTemplate": "Next Quarter Payment",
      "serviceListTemplate": "Startup India Registration",
      "websiteTemplate": "Website",
      "isoTemplate": "Service List",
      "_id": "69be59755b3bd74db3d3ca20",
      "createdAt": "2026-03-21T08:40:21.864Z",
      "updatedAt": "2026-03-21T08:40:21.864Z",
      "__v": 0
    },
    "message": "Settings retrieved successfully",
    "success": true
  }
  ```

### 1.2 Update General Settings
- **Endpoint:** `PUT http://localhost:5000/api/v1/settings/general`
- **Request Body (JSON Example):**
  ```json
  {
    "invoicePrefix": "INV-24-25",
    "invoiceStartingNumber": 10835,
    "emailFromName": "Startup Station",
    "fromEmail": "bizdev@startupstation.in",
    "invoiceTemplate": "Annual Compliance Service - Ritu Kaur",
    "gstTemplate": "GST Filing",
    "ptaxTemplate": "Professional Tax",
    "startupIndiaTemplate": "Startup India Promotion",
    "inc20Template": "INC 20A Reminder",
    "recurringInvoiceTemplate": "Next Quarter Payment",
    "serviceListTemplate": "Startup India Registration",
    "websiteTemplate": "Website",
    "isoTemplate": "Service List"
  }
  ```
- **Expected Real Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "_id": "69be59755b3bd74db3d3ca20",
      "invoicePrefix": "INV-24-25",
      "invoiceStartingNumber": 10835,
      "emailFromName": "Startup Station",
      "fromEmail": "bizdev@startupstation.in",
      "invoiceTemplate": "Annual Compliance Service - Ritu Kaur",
      "gstTemplate": "GST Filing",
      "ptaxTemplate": "Professional Tax",
      "startupIndiaTemplate": "Startup India Promotion",
      "inc20Template": "INC 20A Reminder",
      "recurringInvoiceTemplate": "Next Quarter Payment",
      "serviceListTemplate": "Startup India Registration",
      "websiteTemplate": "Website",
      "isoTemplate": "Service List",
      "createdAt": "2026-03-21T08:40:21.864Z",
      "updatedAt": "2026-03-21T08:40:22.172Z",
      "__v": 0
    },
    "message": "Settings updated successfully",
    "success": true
  }
  ```

---

## 2. Email Counts / Logs API (Section 2)

This API tracks the number of automated or manual emails sent out by the CRM, filtered by a date range.

### 2.1 Fetch Email Count History
- **Endpoint:** `GET http://localhost:5000/api/v1/settings/email-count`
- **Query Parameters:** `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- **Expected Real Response (200 OK):**
  ```json
  {
    "status": true,
    "total": 0,
    "data": []
  }
  ```
