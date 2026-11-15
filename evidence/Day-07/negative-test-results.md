# Day 07 — Negative Testing & Error Handling Verification Results

**Executed:** 2026-11-15 23:12:11 (Local) / 2026-11-15 17:42:11 UTC
**Environment:** Express.js REST API (`http://localhost:5000/api`) + PostgreSQL 18.6 (`visionroot_service_requests`)
**Branch:** `feature/day-07-fullstack-integration`
**Test Runner:** `powershell.exe` & `curl.exe` (`scratch/day07-negative-tests.ps1`)
**Baseline Database Count:** 9 records
**Post-Test Database Count:** 9 records (Zero database pollution)

---

## 1. Summary

| Metric | Value |
| :--- | :--- |
| **Negative Tests Executed** | 8 |
| **Passed** | 8 |
| **Failed** | 0 |
| **Success Rate** | 100% |
| **Database Pollution** | 0 records created (Count remained at 9) |
| **State Machine Guard** | Strictly prevented modifying terminal `CLOSED` record |
| **CORS Preflight Probe** | Verified (HTTP 204 No Content with `Access-Control-Allow-Origin: http://localhost:3000`) |

---

## 2. Detailed Negative API Test Results

### [+] Test 1: Empty Title Validation
```http
POST http://localhost:5000/api/requests
Content-Type: application/json

Payload:
{
  "title": "",
  "description": "Valid description that is long enough",
  "category": "IT"
}

HTTP Status: 400 Bad Request (Expected: 400)
Response Body:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [
      {
        "field": "title",
        "message": "Title is required and cannot be blank"
      }
    ]
  },
  "timestamp": "2026-11-15T17:42:11.236Z"
}
Result: PASS
```

### [+] Test 2: Title Below Minimum Length (< 5 Characters)
```http
POST http://localhost:5000/api/requests
Content-Type: application/json

Payload:
{
  "title": "Desk",
  "description": "Valid description that is long enough",
  "category": "IT"
}

HTTP Status: 400 Bad Request (Expected: 400)
Response Body:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [
      {
        "field": "title",
        "message": "Title must be at least 5 characters long (currently 4)"
      }
    ]
  },
  "timestamp": "2026-11-15T17:42:11.274Z"
}
Result: PASS
```

### [+] Test 3: Description Below Minimum Length (< 10 Characters)
```http
POST http://localhost:5000/api/requests
Content-Type: application/json

Payload:
{
  "title": "Valid Title Here",
  "description": "Short",
  "category": "IT"
}

HTTP Status: 400 Bad Request (Expected: 400)
Response Body:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [
      {
        "field": "description",
        "message": "Description must be at least 10 characters long (currently 5)"
      }
    ]
  },
  "timestamp": "2026-11-15T17:42:11.307Z"
}
Result: PASS
```

### [+] Test 4: Invalid Category Enum Value
```http
POST http://localhost:5000/api/requests
Content-Type: application/json

Payload:
{
  "title": "Valid Title Here",
  "description": "Valid description that is long enough",
  "category": "Finance"
}

HTTP Status: 400 Bad Request (Expected: 400)
Response Body:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [
      {
        "field": "category",
        "message": "Category must be one of: IT, Facilities, Other"
      }
    ]
  },
  "timestamp": "2026-11-15T17:42:11.333Z"
}
Result: PASS
```

### [+] Test 5: Invalid Priority Enum Value
```http
POST http://localhost:5000/api/requests
Content-Type: application/json

Payload:
{
  "title": "Valid Title Here",
  "description": "Valid description that is long enough",
  "category": "IT",
  "priority": "CRITICAL"
}

HTTP Status: 400 Bad Request (Expected: 400)
Response Body:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [
      {
        "field": "priority",
        "message": "Priority must be one of: LOW, MEDIUM, HIGH"
      }
    ]
  },
  "timestamp": "2026-11-15T17:42:11.363Z"
}
Result: PASS
```

### [+] Test 6: Nonexistent Request UUID (404)
```http
GET http://localhost:5000/api/requests/00000000-0000-0000-0000-000000000000

HTTP Status: 404 Not Found (Expected: 404)
Response Body:
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Service request with ID '00000000-0000-0000-0000-000000000000' was not found"
  },
  "timestamp": "2026-11-15T17:42:11.409Z"
}
Result: PASS
```

### [+] Test 7: Malformed Identifier (400)
```http
GET http://localhost:5000/api/requests/not-a-valid-uuid

HTTP Status: 400 Bad Request (Expected: 400)
Response Body:
{
  "success": false,
  "error": {
    "code": "INVALID_IDENTIFIER",
    "message": "The provided request ID 'not-a-valid-uuid' is not a valid UUID"
  },
  "timestamp": "2026-11-15T17:42:11.447Z"
}
Result: PASS
```

### [+] Test 8: State Machine Guard — Reject Modification on Terminal CLOSED Record
```http
PATCH http://localhost:5000/api/requests/84641b37-1895-4988-8ecf-495315da64df/status
Content-Type: application/json

Payload:
{
  "status": "OPEN"
}

HTTP Status: 400 Bad Request (Expected: 400)
Response Body:
{
  "success": false,
  "error": {
    "code": "INVALID_STATE_TRANSITION",
    "message": "Cannot modify a service request that is already in terminal 'CLOSED' status."
  },
  "timestamp": "2026-11-15T17:42:11.490Z"
}
Result: PASS
```

---

## 3. Database Non-Pollution Verification

A strict count query was executed before and after running the negative test suite:

- **Record count prior to negative tests:** `9`
- **Record count after 5 invalid POST attempts and 3 invalid read/update queries:** `9`
- **Result:** 100% verified. No garbage, partial records, or modified fields were committed to the PostgreSQL table `service_requests`.

---

## 4. CORS Behavior & Preflight Verification

An explicit HTTP `OPTIONS` preflight probe was executed to verify CORS compliance:

```http
OPTIONS http://localhost:5000/api/requests
Origin: http://localhost:3000
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type

Response Headers:
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:3000
Vary: Origin, Access-Control-Request-Headers
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
Access-Control-Allow-Headers: Content-Type
Content-Length: 0
```

### Identified Configuration Behavior & Limitations:
1. **Configured Allowed Origin:** `http://localhost:3000` (Next.js local development origin).
2. **Behavior on Unauthorized Origins:** When queried from origins other than `http://localhost:3000`, the server responds with `Access-Control-Allow-Origin: http://localhost:3000`. In compliant browser environments, cross-origin requests from any other hostname, IP, or port will be blocked by the client's same-origin policy.
3. **Limitation Note:** The backend currently binds CORS to a single origin configured via `process.env.CORS_ORIGIN || 'http://localhost:3000'`. Staging or production environments with different frontend hostnames must set `CORS_ORIGIN` in `backend/.env`.
