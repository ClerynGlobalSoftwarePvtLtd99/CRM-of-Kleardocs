# Kleardocs CRM - Leads API Testing Guide
*(For Postman, Requestly, or Thunder Client)*

## Prerequisites
- Make sure you are logged in first via `POST /api/v1/auth/login`
- The `accessToken` cookie is automatically attached to all subsequent requests
- Or use `Authorization: Bearer <accessToken>` header manually

## Base URL
`http://localhost:5000/api/v1/leads`

---

## 1. Get All Leads (with filters)

**GET** `http://localhost:5000/api/v1/leads`

| Query Param | Description | Example |
|---|---|---|
| `search` | Search by name/phone/company | `search=John` |
| `dateType` | `created`, `lastFollowup`, `nextFollowup` | `dateType=created` |
| `startDate` | ISO date string | `startDate=2026-01-01` |
| `endDate` | ISO date string | `endDate=2026-12-31` |
| `source` | `Instagram`, `Facebook`, `YouTube`, `WhatsApp`, `Referral`, `Website`, `Cold Call`, `Other` | `source=Instagram` |
| `type` | `Hot`, `Cold`, `Warm` | `type=Hot` |
| `priority` | `High`, `Medium`, `Low` | `priority=High` |
| `response` | `Interested`, `Not Interested`, `Call Back`, `No Response`, `Converted` | `response=Interested` |
| `page` | Page number | `page=1` |
| `limit` | Items per page | `limit=20` |

**Example Response (200):**
```json
{
  "statusCode": 200,
  "data": { "count": 10, "leads": [...] },
  "message": "Leads fetched successfully",
  "success": true
}
```

---

## 2. Create a Lead

**POST** `http://localhost:5000/api/v1/leads`

```json
{
  "name": "John Doe",
  "phone": "9999999999",
  "companyName": "Acme Ltd",
  "source": "Facebook",
  "type": "Hot",
  "priority": "High",
  "response": "Interested",
  "address": "Mumbai",
  "state": "MAHARASHTRA"
}
```

**Expected Response (201):**
```json
{
  "statusCode": 201,
  "data": { "_id": "...", "name": "John Doe", ... },
  "message": "Lead created successfully",
  "success": true
}
```

---

## 3. Get Single Lead (with full history)

**GET** `http://localhost:5000/api/v1/leads/:leadId`

---

## 4. Update Lead

**PUT** `http://localhost:5000/api/v1/leads/:leadId`

```json
{
  "type": "Cold",
  "response": "Call Back",
  "priority": "Low"
}
```

---

## 5. Add Follow-up

**POST** `http://localhost:5000/api/v1/leads/:leadId/followup`

```json
{
  "followupDate": "2026-04-01",
  "phoneCalled": true,
  "details": "Customer asked for callback next week"
}
```

---

## 6. Add Interaction / Note

**POST** `http://localhost:5000/api/v1/leads/:leadId/interaction`

```json
{
  "details": "Customer is very interested in Annual Compliance package",
  "phoneCalled": true
}
```

---

## 7. Update Lead Emails

**PUT** `http://localhost:5000/api/v1/leads/:leadId/emails`

```json
{
  "emails": ["john@acme.com", "contact@acme.com"]
}
```

---

## 8. Assign Agent to Lead *(Admin only)*

**PUT** `http://localhost:5000/api/v1/leads/:leadId/assign`

```json
{
  "agentId": "<valid_user_object_id>"
}
```

---

## 9. Convert Lead to Customer

**POST** `http://localhost:5000/api/v1/leads/:leadId/convert`

```json
{
  "companyName": "Acme Pvt Ltd",
  "address": "Mumbai, Maharashtra",
  "state": "MAHARASHTRA",
  "gst": "27AABCU9603R1ZX",
  "type": "Private Limited Company",
  "incorporationDate": "2020-01-01",
  "newlyIncorporated": false,
  "username": "ACME0001"
}
```

**Expected Response (200):**
```json
{
  "statusCode": 200,
  "data": { "customerId": "..." },
  "message": "Lead converted to customer successfully",
  "success": true
}
```

---

## 10. Error Examples

**Lead not found (404):**
```json
{ "success": false, "message": "Lead not found", "errors": [] }
```

**Already converted (400):**
```json
{ "success": false, "message": "This lead is already a customer", "errors": [] }
```

**Not Authorized (403):**
```json
{ "success": false, "message": "Forbidden", "errors": [] }
```
