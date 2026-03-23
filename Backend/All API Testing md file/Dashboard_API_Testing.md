# Dashboard & Customer Portal API Testing Guide

This document outlines the real API endpoints, methods, parameters, and exact responses for the Dashboard, Graph, Email Logs, and Customer Portal features based on live testing.

---

## 1. Dashboard Aggregation APIs

These APIs provide the statistical summary data shown on the top section of the dashboard. They all accept an optional date range filter.

### 1.1 Leads Summary
- **Endpoint:** `GET http://localhost:5000/api/v1/dashboard/leads`
- **Query Parameters:** `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- **Expected Real Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "total": 0,
      "new": 0,
      "interacted": 1,
      "hot": 0,
      "cold": 0
    },
    "message": "Leads summary retrieved successfully",
    "success": true
  }
  ```

### 1.2 Customers Summary
- **Endpoint:** `GET http://localhost:5000/api/v1/dashboard/customers`
- **Query Parameters:** `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- **Expected Real Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "total": 2,
      "withAnnualCompliance": 1
    },
    "message": "Customers summary retrieved successfully",
    "success": true
  }
  ```

### 1.3 Sales & Invoices Summary
- **Endpoint:** `GET http://localhost:5000/api/v1/dashboard/sales`
- **Query Parameters:** `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- **Expected Real Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "totalInvoices": 3,
      "totalSales": 24780,
      "totalPayments": 3,
      "paymentReceived": 9000,
      "unpaidPartialInvoices": 3,
      "totalDues": 15780
    },
    "message": "Sales summary retrieved successfully",
    "success": true
  }
  ```

### 1.4 Compliances & Jobs Summary
- **Endpoint:** `GET http://localhost:5000/api/v1/dashboard/compliance-jobs`
- **Query Parameters:** `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- **Expected Real Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "expiredNotDoneCompliances": 0,
      "notDoneCompliances": 0,
      "ongoingCompliances": 0,
      "expiredNotDoneJobs": 0,
      "notDoneJobs": 0,
      "ongoingJobs": 0
    },
    "message": "Compliance & Jobs summary retrieved successfully",
    "success": true
  }
  ```

---

## 2. Graph Basic API

This API provides the time-series data required to render the column charts.

### 2.1 Dashboard Graphs
- **Endpoint:** `GET http://localhost:5000/api/v1/dashboard/graphs`
- **Query Parameters:** `?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
- **Expected Real Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "dailyLeads": [],
      "dailyInteractions": [
        {
          "count": 1,
          "date": "2026-03-19"
        }
      ],
      "dailySales": [
        {
          "date": "2026-03-20",
          "amount": 24780
        }
      ],
      "dailySalesCount": [
        {
          "date": "2026-03-20",
          "count": 3
        }
      ]
    },
    "message": "Graphs data retrieved successfully",
    "success": true
  }
  ```

---

## 3. Email Logs API

This API tracks the number of automated or manual emails sent out by the CRM.

### 3.1 Email Count / Logs
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

---

## 4. Customer Portal Login API

### 4.1 Customer Login Auth
- **Endpoint:** `POST http://localhost:5000/api/v1/auth/customer-login`
- **Request Body (JSON):**
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```
- **Real Error Response (401 Unauthorized):**
  ```json
  {
    "success": false,
    "message": "Invalid credentials",
    "errors": []
  }
  ```
- **Real Success Response Profile (200 OK):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "customer": {
        "id": "698092c965b9911c9c0b0033",
        "name": "Test User",
        "companyName": "Acme Pvt Ltd",
        "username": "ACME0001"
      },
      "accessToken": "eyJhbGciOiJIUzI1..."
    },
    "message": "Customer logged in successfully",
    "success": true
  }
  ```
