# Service Request Management System — REST API Contract & Specification

**Document Version:** 1.0.0  
**Phase:** Day 02 — Architecture & System Design  
**Author:** Trainee Software Engineer, VisionRoot (Pvt) Ltd  
**Protocol:** HTTP/1.1 over TLS (HTTPS)  
**Data Format:** JSON (`Content-Type: application/json; charset=utf-8`)  
**Base URL:** `http://localhost:5000/api`  

---

## 1. Global API Standards & Response Envelopes

To ensure predictable integration between the Next.js frontend and the Express.js backend, all API responses adhere to a consistent JSON response envelope.

### 1.1 Success Response Envelope
All successful requests ($2xx$) wrap the payload inside a `data` key alongside a boolean `success: true`:

```json
{
  "success": true,
  "data": { ... }
}
```

### 1.2 Error Response Envelope
All failure requests ($4xx$, $5xx$) return a standardized error object containing an application-specific error code, a descriptive message, an optional array of field-level validation details, and a server timestamp:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request payload failed validation checks",
    "details": [
      {
        "field": "title",
        "message": "Title must be at least 5 characters long"
      }
    ]
  },
  "timestamp": "2026-11-12T00:15:30.000Z"
}
```

### 1.3 Standard Error Codes Dictionary

| Error Code | HTTP Status | Description / Trigger Condition |
| :--- | :---: | :--- |
| `VALIDATION_ERROR` | `400` | Incoming payload fails syntactic or schema constraints (e.g. string length, invalid enum). |
| `INVALID_STATE_TRANSITION` | `400` | Attempted status change violates state machine rules (e.g. `OPEN` $\rightarrow$ `RESOLVED` or modifying a `CLOSED` ticket). |
| `INVALID_IDENTIFIER` | `400` | The provided ID in the URL path is not a valid UUID v4 string. |
| `NOT_FOUND` | `404` | Requested resource with specified ID does not exist in the database. |
| `INTERNAL_SERVER_ERROR` | `500` | Unexpected unhandled server exception (sanitized in production, no leaked stack traces). |
| `SERVICE_UNAVAILABLE` | `503` | Dependent infrastructure service (e.g. PostgreSQL) is unreachable during health check. |

---

## 2. API Endpoints Specification

### 2.1 Create Service Request

- **Endpoint:** `/api/requests`
- **Method:** `POST`
- **Summary:** Submits a new IT or Facilities service request into the system.
- **Headers:**
  - `Content-Type: application/json`
  - `Accept: application/json`

#### Request Body Schema
| Field | Type | Required | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- |
| `title` | `string` | **Yes** | 5 – 100 characters, whitespace trimmed | Concise title describing the problem. |
| `description` | `string` | **Yes** | 10 – 1000 characters, whitespace trimmed | Full details of the request. |
| `category` | `string` | **Yes** | Enum: `'IT'`, `'Facilities'`, `'Other'` | Category of the service required. |
| `priority` | `string` | No | Enum: `'LOW'`, `'MEDIUM'`, `'HIGH'` (Default: `'MEDIUM'`) | Urgency level of the request. |

#### Request Body Example
```json
{
  "title": "Flickering monitor on Desk 12",
  "description": "The external monitor turns black intermittently when connected via HDMI cable.",
  "category": "IT",
  "priority": "HIGH"
}
```

#### Success Response: `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Flickering monitor on Desk 12",
    "description": "The external monitor turns black intermittently when connected via HDMI cable.",
    "category": "IT",
    "priority": "HIGH",
    "status": "OPEN",
    "created_at": "2026-11-12T00:10:00.000Z",
    "updated_at": "2026-11-12T00:10:00.000Z"
  }
}
```

#### Error Response: `400 Bad Request` (Validation Failure)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [
      {
        "field": "title",
        "message": "Title must be at least 5 characters long"
      },
      {
        "field": "category",
        "message": "Category must be one of: IT, Facilities, Other"
      }
    ]
  },
  "timestamp": "2026-11-12T00:10:05.120Z"
}
```

---

### 2.2 List and Filter Service Requests

- **Endpoint:** `/api/requests`
- **Method:** `GET`
- **Summary:** Retrieves a list of service requests, ordered newest first (`created_at DESC`), with optional filtering by status.
- **Query Parameters:**
  | Parameter | Type | Required | Values / Format | Description |
  | :--- | :--- | :---: | :--- | :--- |
  | `status` | `string` | No | `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED` | Filter requests matching a specific status. |
  | `limit` | `integer`| No | $1 - 100$ (Default: `50`) | Maximum number of records to return. |
  | `offset` | `integer`| No | $\ge 0$ (Default: `0`) | Pagination offset. |

#### Request Example
`GET /api/requests?status=OPEN`

#### Success Response: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Flickering monitor on Desk 12",
      "description": "The external monitor turns black intermittently when connected via HDMI cable.",
      "category": "IT",
      "priority": "HIGH",
      "status": "OPEN",
      "created_at": "2026-11-12T00:10:00.000Z",
      "updated_at": "2026-11-12T00:10:00.000Z"
    },
    {
      "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      "title": "Air conditioning water leak in Meeting Room B",
      "description": "Ceiling unit is dripping water onto the conference table.",
      "category": "Facilities",
      "priority": "HIGH",
      "status": "OPEN",
      "created_at": "2026-11-12T00:05:00.000Z",
      "updated_at": "2026-11-12T00:05:00.000Z"
    }
  ]
}
```

#### Error Response: `400 Bad Request` (Invalid Status Parameter)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameter 'status'",
    "details": [
      {
        "field": "status",
        "message": "Status must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED"
      }
    ]
  },
  "timestamp": "2026-11-12T00:12:00.000Z"
}
```

---

### 2.3 Get Single Service Request by ID

- **Endpoint:** `/api/requests/:id`
- **Method:** `GET`
- **Summary:** Fetches detailed information for a specific service request by its unique UUID.
- **Path Parameters:**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :---: | :--- |
  | `id` | `UUID` | **Yes** | Standard RFC 4122 UUID v4 string. |

#### Request Example
`GET /api/requests/550e8400-e29b-41d4-a716-446655440000`

#### Success Response: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Flickering monitor on Desk 12",
    "description": "The external monitor turns black intermittently when connected via HDMI cable.",
    "category": "IT",
    "priority": "HIGH",
    "status": "OPEN",
    "created_at": "2026-11-12T00:10:00.000Z",
    "updated_at": "2026-11-12T00:10:00.000Z"
  }
}
```

#### Error Response: `404 Not Found`
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Service request with ID '550e8400-e29b-41d4-a716-446655440000' was not found"
  },
  "timestamp": "2026-11-12T00:13:10.000Z"
}
```

#### Error Response: `400 Bad Request` (Invalid UUID format)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_IDENTIFIER",
    "message": "The provided request ID 'abc-123' is not a valid UUID"
  },
  "timestamp": "2026-11-12T00:13:15.000Z"
}
```

---

### 2.4 Update Service Request Status

- **Endpoint:** `/api/requests/:id/status`
- **Method:** `PATCH`
- **Summary:** Advances or changes the lifecycle state of a service request according to the governed state transition workflow.
- **Path Parameters:**
  | Parameter | Type | Required | Description |
  | :--- | :--- | :---: | :--- |
  | `id` | `UUID` | **Yes** | The UUID of the request to update. |

#### Request Body Schema
| Field | Type | Required | Constraints | Description |
| :--- | :--- | :---: | :--- | :--- |
| `status` | `string` | **Yes** | Enum: `'OPEN'`, `'IN_PROGRESS'`, `'RESOLVED'`, `'CLOSED'` | The desired new status. |

#### Request Body Example
```json
{
  "status": "IN_PROGRESS"
}
```

#### Success Response: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Flickering monitor on Desk 12",
    "description": "The external monitor turns black intermittently when connected via HDMI cable.",
    "category": "IT",
    "priority": "HIGH",
    "status": "IN_PROGRESS",
    "created_at": "2026-11-12T00:10:00.000Z",
    "updated_at": "2026-11-12T00:25:00.000Z"
  }
}
```

#### Error Response: `400 Bad Request` (Illegal Status Transition)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATE_TRANSITION",
    "message": "Cannot transition request from 'OPEN' directly to 'RESOLVED'. Allowed target statuses: 'IN_PROGRESS', 'CLOSED'."
  },
  "timestamp": "2026-11-12T00:26:00.000Z"
}
```

#### Error Response: `400 Bad Request` (Attempted Modification on Terminal State)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATE_TRANSITION",
    "message": "Cannot modify a service request that is already in terminal 'CLOSED' status."
  },
  "timestamp": "2026-11-12T00:26:30.000Z"
}
```

---

### 2.5 System Health Check

- **Endpoint:** `/api/health`
- **Method:** `GET`
- **Summary:** Probes backend server uptime and verifies active connectivity to PostgreSQL.
- **Headers:** `Accept: application/json`

#### Success Response: `200 OK` (Healthy)
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime_seconds": 1845.2,
    "timestamp": "2026-11-12T00:30:00.000Z",
    "database": {
      "status": "connected",
      "latency_ms": 3
    }
  }
}
```

#### Error Response: `503 Service Unavailable` (Database Failure)
```json
{
  "success": false,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "System health probe failed",
    "details": [
      {
        "component": "database",
        "status": "disconnected",
        "error": "Connection to PostgreSQL host failed on port 5432"
      }
    ]
  },
  "timestamp": "2026-11-12T00:30:05.000Z"
}
```

---

## 3. Summary of HTTP Status Codes Used

| Status Code | Meaning | Used in Scenarios |
| :---: | :--- | :--- |
| `200 OK` | Request succeeded | `GET` requests list/details, `PATCH` successful status change, `GET /api/health` healthy. |
| `201 Created` | Resource created | `POST /api/requests` when new ticket is successfully inserted. |
| `400 Bad Request` | Client input error | Schema validation errors, illegal state transitions, malformed UUID. |
| `404 Not Found` | Resource does not exist | Specified request UUID not present in database. |
| `500 Internal Error`| Unhandled server defect| Unexpected unhandled exceptions caught by centralized error middleware. |
| `503 Unavailable` | Dependency down | Database connection check failure during `/api/health`. |
