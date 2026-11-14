# Day 06 — Database & Persistence API Regression Test Results

**Executed:** 2026-11-14 23:36:01
**Target RDBMS:** PostgreSQL 18.6
**Database:** visionroot_service_requests
**Server Base URL:** http://localhost:5000
**Branch:** feature/day-06-postgresql-persistence
**Test Runner:** curl.exe & PowerShell Test Suite

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tests Executed** | 29 |
| **Passed** | 29 |
| **Failed** | 0 |
| **Success Rate** | 100% |
| **Persistence Verification** | Verified (PostgreSQL live read/write) |
| **State Machine Enforcement** | Verified (Strict linear OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED) |

---

## Detailed Test Results

### [+] 1. Health endpoint returns 200 with database connected
```
GET http://localhost:5000/api/health
HTTP Status: 200 (Expected: 200)
Response Body:
{
    "success":  true,
    "data":  {
                 "status":  "healthy",
                 "uptime_seconds":  652.1,
                 "timestamp":  "2026-11-14T18:05:55.747Z",
                 "environment":  "development",
                 "database":  {
                                  "status":  "connected",
                                  "latency_ms":  151
                              }
             }
}
Result: PASS
```

### [+] 2. List requests from PostgreSQL (orders created_at DESC)
```
GET http://localhost:5000/api/requests
HTTP Status: 200 (Expected: 200)
Response Body:
{
    "success":  true,
    "data":  [
                 {
                     "id":  "8a917a28-3d72-4729-b2cb-e3038a27e712",
                     "title":  "PostgreSQL Persistence Verification Ticket",
                     "description":  "Testing that new service requests are written directly to PostgreSQL.",
                     "category":  "IT",
                     "priority":  "HIGH",
                     "status":  "IN_PROGRESS",
                     "created_at":  "2026-11-14T17:42:14.489Z",
                     "updated_at":  "2026-11-14T17:47:48.148Z"
                 },
                 {
                     "id":  "550e8400-e29b-41d4-a716-446655440000",
                     "title":  "Flickering monitor on Desk 12",
                     "description":  "The external monitor turns black intermittently when connected via HDMI cable to MacBook Pro.",
                     "category":  "IT",
                     "priority":  "HIGH",
                     "status":  "OPEN",
                     "created_at":  "2026-11-12T04:10:00.000Z",
                     "updated_at":  "2026-11-12T04:10:00.000Z"
                 },
                 {
                     "id":  "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
                     "title":  "Air conditioning water leak in Meeting Room B",
                     "description":  "Ceiling AC unit is dripping water directly above the main conference table.",
                     "category":  "Facilities",
                     "priority":  "HIGH",
                     "status":  "IN_PROGRESS",
                     "created_at":  "2026-11-12T03:30:00.000Z",
                     "updated_at":  "2026-11-12T04:00:00.000Z"
                 },
                 {
                     "id":  "7ca7b810-9dad-11d1-80b4-00c04fd430c9",
                     "title":  "VPN access requested for remote finance audit",
                     "description":  "Require secure global VPN provisioning for the external quarterly finance auditing team.",
                     "category":  "IT",
                     "priority":  "MEDIUM",
                     "status":  "OPEN",
                     "created_at":  "2026-11-12T02:15:00.000Z",
                     "updated_at":  "2026-11-12T02:15:00.000Z"
                 },
                 {
                     "id":  "8da7b810-9dad-11d1-80b4-00c04fd430d0",
                     "title":  "Ergonomic keyboard replacement for workstation 4",
                     "description":  "Spacebar key sticking repeatedly on existing wireless keyboard.",
                     "category":  "Other",
                     "priority":  "LOW",
                     "status":  "RESOLVED",
                     "created_at":  "2026-11-11T10:00:00.000Z",
                     "updated_at":  "2026-11-12T01:00:00.000Z"
                 },
                 {
                     "id":  "9ea7b810-9dad-11d1-80b4-00c04fd430d1",
                     "title":  "Cafeteria microwave door latch broken",
                     "description":  "Upper floor cafeteria microwave door fails to latch securely shut.",
                     "category":  "Facilities",
                     "priority":  "LOW",
                     "status":  "CLOSED",
                     "created_at":  "2026-11-10T08:00:00.000Z",
                     "updated_at":  "2026-11-11T16:00:00.000Z"
                 }
             ]
}
Result: PASS
```

### [+] 3. Filter requests by status=OPEN
```
GET http://localhost:5000/api/requests?status=OPEN
HTTP Status: 200 (Expected: 200)
Response Body:
{
    "success":  true,
    "data":  [
                 {
                     "id":  "550e8400-e29b-41d4-a716-446655440000",
                     "title":  "Flickering monitor on Desk 12",
                     "description":  "The external monitor turns black intermittently when connected via HDMI cable to MacBook Pro.",
                     "category":  "IT",
                     "priority":  "HIGH",
                     "status":  "OPEN",
                     "created_at":  "2026-11-12T04:10:00.000Z",
                     "updated_at":  "2026-11-12T04:10:00.000Z"
                 },
                 {
                     "id":  "7ca7b810-9dad-11d1-80b4-00c04fd430c9",
                     "title":  "VPN access requested for remote finance audit",
                     "description":  "Require secure global VPN provisioning for the external quarterly finance auditing team.",
                     "category":  "IT",
                     "priority":  "MEDIUM",
                     "status":  "OPEN",
                     "created_at":  "2026-11-12T02:15:00.000Z",
                     "updated_at":  "2026-11-12T02:15:00.000Z"
                 }
             ]
}
Result: PASS
```

### [+] 4. Filter requests by status=IN_PROGRESS
```
GET http://localhost:5000/api/requests?status=IN_PROGRESS
HTTP Status: 200 (Expected: 200)
Response Body:
{
    "success":  true,
    "data":  [
                 {
                     "id":  "8a917a28-3d72-4729-b2cb-e3038a27e712",
                     "title":  "PostgreSQL Persistence Verification Ticket",
                     "description":  "Testing that new service requests are written directly to PostgreSQL.",
                     "category":  "IT",
                     "priority":  "HIGH",
                     "status":  "IN_PROGRESS",
                     "created_at":  "2026-11-14T17:42:14.489Z",
                     "updated_at":  "2026-11-14T17:47:48.148Z"
                 },
                 {
                     "id":  "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
                     "title":  "Air conditioning water leak in Meeting Room B",
                     "description":  "Ceiling AC unit is dripping water directly above the main conference table.",
                     "category":  "Facilities",
                     "priority":  "HIGH",
                     "status":  "IN_PROGRESS",
                     "created_at":  "2026-11-12T03:30:00.000Z",
                     "updated_at":  "2026-11-12T04:00:00.000Z"
                 }
             ]
}
Result: PASS
```

### [+] 5. Get existing seed request by ID
```
GET http://localhost:5000/api/requests/550e8400-e29b-41d4-a716-446655440000
HTTP Status: 200 (Expected: 200)
Response Body:
{
    "success":  true,
    "data":  {
                 "id":  "550e8400-e29b-41d4-a716-446655440000",
                 "title":  "Flickering monitor on Desk 12",
                 "description":  "The external monitor turns black intermittently when connected via HDMI cable to MacBook Pro.",
                 "category":  "IT",
                 "priority":  "HIGH",
                 "status":  "OPEN",
                 "created_at":  "2026-11-12T04:10:00.000Z",
                 "updated_at":  "2026-11-12T04:10:00.000Z"
             }
}
Result: PASS
```

### [+] 6. Get verified user record by ID (8a917a28-...)
```
GET http://localhost:5000/api/requests/8a917a28-3d72-4729-b2cb-e3038a27e712
HTTP Status: 200 (Expected: 200)
Response Body:
{
    "success":  true,
    "data":  {
                 "id":  "8a917a28-3d72-4729-b2cb-e3038a27e712",
                 "title":  "PostgreSQL Persistence Verification Ticket",
                 "description":  "Testing that new service requests are written directly to PostgreSQL.",
                 "category":  "IT",
                 "priority":  "HIGH",
                 "status":  "IN_PROGRESS",
                 "created_at":  "2026-11-14T17:42:14.489Z",
                 "updated_at":  "2026-11-14T17:47:48.148Z"
             }
}
Result: PASS
```

### [+] 7. Create new request in PostgreSQL (INSERT ... RETURNING)
```
POST http://localhost:5000/api/requests
Payload: {"title":"[AutoTest] PostgreSQL Live Persistence Record","description":"Automated regression test verifying direct write to PostgreSQL table.","category":"IT","priority":"HIGH"}
HTTP Status: 201 (Expected: 201)
Response Body:
{
    "success":  true,
    "data":  {
                 "id":  "9846826b-f54e-407f-a839-3ae3b1d8a37e",
                 "title":  "[AutoTest] PostgreSQL Live Persistence Record",
                 "description":  "Automated regression test verifying direct write to PostgreSQL table.",
                 "category":  "IT",
                 "priority":  "HIGH",
                 "status":  "OPEN",
                 "created_at":  "2026-11-14T18:05:58.343Z",
                 "updated_at":  "2026-11-14T18:05:58.343Z"
             }
}
Result: PASS
```

### [+] 8. Read back newly created request by ID from PostgreSQL
```
GET http://localhost:5000/api/requests/9846826b-f54e-407f-a839-3ae3b1d8a37e
HTTP Status: 200 (Expected: 200)
Response Body:
{
    "success":  true,
    "data":  {
                 "id":  "9846826b-f54e-407f-a839-3ae3b1d8a37e",
                 "title":  "[AutoTest] PostgreSQL Live Persistence Record",
                 "description":  "Automated regression test verifying direct write to PostgreSQL table.",
                 "category":  "IT",
                 "priority":  "HIGH",
                 "status":  "OPEN",
                 "created_at":  "2026-11-14T18:05:58.343Z",
                 "updated_at":  "2026-11-14T18:05:58.343Z"
             }
}
Result: PASS
```

### [+] 9. Transition OPEN -> IN_PROGRESS in PostgreSQL
```
PATCH http://localhost:5000/api/requests/9846826b-f54e-407f-a839-3ae3b1d8a37e/status
Payload: {"status":"IN_PROGRESS"}
HTTP Status: 200 (Expected: 200)
Response Body:
{
    "success":  true,
    "data":  {
                 "id":  "9846826b-f54e-407f-a839-3ae3b1d8a37e",
                 "title":  "[AutoTest] PostgreSQL Live Persistence Record",
                 "description":  "Automated regression test verifying direct write to PostgreSQL table.",
                 "category":  "IT",
                 "priority":  "HIGH",
                 "status":  "IN_PROGRESS",
                 "created_at":  "2026-11-14T18:05:58.343Z",
                 "updated_at":  "2026-11-14T18:06:00.073Z"
             }
}
Result: PASS
```

### [+] 10. Transition IN_PROGRESS -> RESOLVED in PostgreSQL
```
PATCH http://localhost:5000/api/requests/9846826b-f54e-407f-a839-3ae3b1d8a37e/status
Payload: {"status":"RESOLVED"}
HTTP Status: 200 (Expected: 200)
Response Body:
{
    "success":  true,
    "data":  {
                 "id":  "9846826b-f54e-407f-a839-3ae3b1d8a37e",
                 "title":  "[AutoTest] PostgreSQL Live Persistence Record",
                 "description":  "Automated regression test verifying direct write to PostgreSQL table.",
                 "category":  "IT",
                 "priority":  "HIGH",
                 "status":  "RESOLVED",
                 "created_at":  "2026-11-14T18:05:58.343Z",
                 "updated_at":  "2026-11-14T18:06:00.484Z"
             }
}
Result: PASS
```

### [+] 11. Transition RESOLVED -> CLOSED in PostgreSQL
```
PATCH http://localhost:5000/api/requests/9846826b-f54e-407f-a839-3ae3b1d8a37e/status
Payload: {"status":"CLOSED"}
HTTP Status: 200 (Expected: 200)
Response Body:
{
    "success":  true,
    "data":  {
                 "id":  "9846826b-f54e-407f-a839-3ae3b1d8a37e",
                 "title":  "[AutoTest] PostgreSQL Live Persistence Record",
                 "description":  "Automated regression test verifying direct write to PostgreSQL table.",
                 "category":  "IT",
                 "priority":  "HIGH",
                 "status":  "CLOSED",
                 "created_at":  "2026-11-14T18:05:58.343Z",
                 "updated_at":  "2026-11-14T18:06:00.593Z"
             }
}
Result: PASS
```

### [+] 12. Reject modification on terminal CLOSED record
```
PATCH http://localhost:5000/api/requests/9846826b-f54e-407f-a839-3ae3b1d8a37e/status
Payload: {"status":"OPEN"}
HTTP Status: 400 (Expected: 400)
Response Body:
{
    "success":  false,
    "error":  {
                  "code":  "INVALID_STATE_TRANSITION",
                  "message":  "Cannot modify a service request that is already in terminal \u0027CLOSED\u0027 status."
              },
    "timestamp":  "2026-11-14T18:06:00.620Z"
}
Result: PASS
```

### [+] 13. Reject invalid transition OPEN -> RESOLVED (cannot skip)
```
PATCH http://localhost:5000/api/requests/550e8400-e29b-41d4-a716-446655440000/status
Payload: {"status":"RESOLVED"}
HTTP Status: 400 (Expected: 400)
Response Body:
{
    "success":  false,
    "error":  {
                  "code":  "INVALID_STATE_TRANSITION",
                  "message":  "Cannot transition request from \u0027OPEN\u0027 directly to \u0027RESOLVED\u0027. Allowed target statuses: \u0027IN_PROGRESS\u0027."
              },
    "timestamp":  "2026-11-14T18:06:00.664Z"
}
Result: PASS
```

### [+] 14. Reject invalid transition OPEN -> CLOSED (cannot skip)
```
PATCH http://localhost:5000/api/requests/550e8400-e29b-41d4-a716-446655440000/status
Payload: {"status":"CLOSED"}
HTTP Status: 400 (Expected: 400)
Response Body:
{
    "success":  false,
    "error":  {
                  "code":  "INVALID_STATE_TRANSITION",
                  "message":  "Cannot transition request from \u0027OPEN\u0027 directly to \u0027CLOSED\u0027. Allowed target statuses: \u0027IN_PROGRESS\u0027."
              },
    "timestamp":  "2026-11-14T18:06:00.689Z"
}
Result: PASS
```

### [+] 15. Reject invalid transition IN_PROGRESS -> CLOSED
```
PATCH http://localhost:5000/api/requests/6ba7b810-9dad-11d1-80b4-00c04fd430c8/status
Payload: {"status":"CLOSED"}
HTTP Status: 400 (Expected: 400)
Response Body:
{
    "success":  false,
    "error":  {
                  "code":  "INVALID_STATE_TRANSITION",
                  "message":  "Cannot transition request from \u0027IN_PROGRESS\u0027 directly to \u0027CLOSED\u0027. Allowed target statuses: \u0027RESOLVED\u0027."
              },
    "timestamp":  "2026-11-14T18:06:00.737Z"
}
Result: PASS
```

### [+] 16. Reject backward transition IN_PROGRESS -> OPEN
```
PATCH http://localhost:5000/api/requests/6ba7b810-9dad-11d1-80b4-00c04fd430c8/status
Payload: {"status":"OPEN"}
HTTP Status: 400 (Expected: 400)
Response Body:
{
    "success":  false,
    "error":  {
                  "code":  "INVALID_STATE_TRANSITION",
                  "message":  "Cannot transition request from \u0027IN_PROGRESS\u0027 directly to \u0027OPEN\u0027. Allowed target statuses: \u0027RESOLVED\u0027."
              },
    "timestamp":  "2026-11-14T18:06:00.797Z"
}
Result: PASS
```

### [+] 17. Reject transition on existing seed CLOSED record
```
PATCH http://localhost:5000/api/requests/9ea7b810-9dad-11d1-80b4-00c04fd430d1/status
Payload: {"status":"IN_PROGRESS"}
HTTP Status: 400 (Expected: 400)
Response Body:
{
    "success":  false,
    "error":  {
                  "code":  "INVALID_STATE_TRANSITION",
                  "message":  "Cannot modify a service request that is already in terminal \u0027CLOSED\u0027 status."
              },
    "timestamp":  "2026-11-14T18:06:01.164Z"
}
Result: PASS
```

### [+] 18. Reject missing title
```
POST http://localhost:5000/api/requests
Payload: {"description":"Valid description that is long enough","category":"IT"}
HTTP Status: 400 (Expected: 400)
Response Body:
{
    "success":  false,
    "error":  {
                  "code":  "VALIDATION_ERROR",
                  "message":  "Invalid request payload",
                  "details":  [
                                  {
                                      "field":  "title",
                                      "message":  "Title is required and cannot be blank"
                                  }
                              ]
              },
    "timestamp":  "2026-11-14T18:06:01.199Z"
}
Result: PASS
```

### [+] 19. Reject title < 5 characters
```
POST http://localhost:5000/api/requests
Payload: {"title":"Hi","description":"Valid description that is long enough","category":"IT"}
HTTP Status: 400 (Expected: 400)
Response Body:
{
    "success":  false,
    "error":  {
                  "code":  "VALIDATION_ERROR",
                  "message":  "Invalid request payload",
                  "details":  [
                                  {
                                      "field":  "title",
                                      "message":  "Title must be at least 5 characters long (currently 2)"
                                  }
                              ]
              },
    "timestamp":  "2026-11-14T18:06:01.223Z"
}
Result: PASS
```

### [+] 20. Reject missing description
```
POST http://localhost:5000/api/requests
Payload: {"title":"Valid title here","category":"IT"}
HTTP Status: 400 (Expected: 400)
Response Body:
{
    "success":  false,
    "error":  {
                  "code":  "VALIDATION_ERROR",
                  "message":  "Invalid request payload",
                  "details":  [
                                  {
                                      "field":  "description",
                                      "message":  "Description is required"
                                  }
                              ]
              },
    "timestamp":  "2026-11-14T18:06:01.359Z"
}
Result: PASS
```

### [+] 21. Reject description < 10 characters
```
POST http://localhost:5000/api/requests
Payload: {"title":"Valid title here","description":"Short","category":"IT"}
HTTP Status: 400 (Expected: 400)
Response Body:
{
    "success":  false,
    "error":  {
                  "code":  "VALIDATION_ERROR",
                  "message":  "Invalid request payload",
                  "details":  [
                                  {
                                      "field":  "description",
                                      "message":  "Description must be at least 10 characters long (currently 5)"
                                  }
                              ]
              },
    "timestamp":  "2026-11-14T18:06:01.415Z"
}
Result: PASS
```

### [+] 22. Reject invalid category enum
```
POST http://localhost:5000/api/requests
Payload: {"title":"Valid title here","description":"Valid description that is long enough","category":"Finance"}
HTTP Status: 400 (Expected: 400)
Response Body:
{
    "success":  false,
    "error":  {
                  "code":  "VALIDATION_ERROR",
                  "message":  "Invalid request payload",
                  "details":  [
                                  {
                                      "field":  "category",
                                      "message":  "Category must be one of: IT, Facilities, Other"
                                  }
                              ]
              },
    "timestamp":  "2026-11-14T18:06:01.462Z"
}
Result: PASS
```

### [+] 23. Reject invalid priority enum
```
POST http://localhost:5000/api/requests
Payload: {"title":"Valid title here","description":"Valid description that is long enough","category":"IT","priority":"URGENT"}
HTTP Status: 400 (Expected: 400)
Response Body:
{
    "success":  false,
    "error":  {
                  "code":  "VALIDATION_ERROR",
                  "message":  "Invalid request payload",
                  "details":  [
                                  {
                                      "field":  "priority",
                                      "message":  "Priority must be one of: LOW, MEDIUM, HIGH"
                                  }
                              ]
              },
    "timestamp":  "2026-11-14T18:06:01.584Z"
}
Result: PASS
```

### [+] 24. Reject invalid status in PATCH body
```
PATCH http://localhost:5000/api/requests/550e8400-e29b-41d4-a716-446655440000/status
Payload: {"status":"PENDING"}
HTTP Status: 400 (Expected: 400)
Response Body:
{
    "success":  false,
    "error":  {
                  "code":  "VALIDATION_ERROR",
                  "message":  "Invalid request payload",
                  "details":  [
                                  {
                                      "field":  "status",
                                      "message":  "Status must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED"
                                  }
                              ]
              },
    "timestamp":  "2026-11-14T18:06:01.603Z"
}
Result: PASS
```

### [+] 25. Reject malformed UUID (GET /api/requests/:id)
```
GET http://localhost:5000/api/requests/not-a-valid-uuid
HTTP Status: 400 (Expected: 400)
Response Body:
{
    "success":  false,
    "error":  {
                  "code":  "INVALID_IDENTIFIER",
                  "message":  "The provided request ID \u0027not-a-valid-uuid\u0027 is not a valid UUID"
              },
    "timestamp":  "2026-11-14T18:06:01.720Z"
}
Result: PASS
```

### [+] 26. Return 404 for non-existent UUID (GET /api/requests/:id)
```
GET http://localhost:5000/api/requests/00000000-0000-0000-0000-000000000000
HTTP Status: 404 (Expected: 404)
Response Body:
{
    "success":  false,
    "error":  {
                  "code":  "NOT_FOUND",
                  "message":  "Service request with ID \u002700000000-0000-0000-0000-000000000000\u0027 was not found"
              },
    "timestamp":  "2026-11-14T18:06:01.779Z"
}
Result: PASS
```

### [+] 27. Reject malformed UUID in PATCH status endpoint
```
PATCH http://localhost:5000/api/requests/not-a-valid-uuid/status
Payload: {"status":"IN_PROGRESS"}
HTTP Status: 400 (Expected: 400)
Response Body:
{
    "success":  false,
    "error":  {
                  "code":  "INVALID_IDENTIFIER",
                  "message":  "The provided request ID \u0027not-a-valid-uuid\u0027 is not a valid UUID"
              },
    "timestamp":  "2026-11-14T18:06:01.830Z"
}
Result: PASS
```

### [+] 28. Return 404 for non-existent UUID in PATCH status endpoint
```
PATCH http://localhost:5000/api/requests/00000000-0000-0000-0000-000000000000/status
Payload: {"status":"IN_PROGRESS"}
HTTP Status: 404 (Expected: 404)
Response Body:
{
    "success":  false,
    "error":  {
                  "code":  "NOT_FOUND",
                  "message":  "Service request with ID \u002700000000-0000-0000-0000-000000000000\u0027 was not found"
              },
    "timestamp":  "2026-11-14T18:06:01.867Z"
}
Result: PASS
```

### [+] 29. Return 404 for unmatched API route
```
GET http://localhost:5000/api/unknown-endpoint
HTTP Status: 404 (Expected: 404)
Response Body:
{
    "success":  false,
    "error":  {
                  "code":  "NOT_FOUND",
                  "message":  "The requested endpoint GET /api/unknown-endpoint does not exist"
              },
    "timestamp":  "2026-11-14T18:06:01.906Z"
}
Result: PASS
```

---

## PostgreSQL Invariant & Isolation Verification

```
PostgreSQL Database: visionroot_service_requests
Schema: public
Tables Verified:
  1. schema_migrations — tracks versioned migration execution
  2. service_requests — persistent entity storage with check constraints & indexes

Data Integrity & Invariants Confirmed:
  [+] PostgreSQL Date objects normalized to ISO-8601 UTC strings (.toISOString())
  [+] User development records preserved untouched (ID: 8a917a28-3d72-4729-b2cb-e3038a27e712)
  [+] 5 standard demo seed records preserved with unchanged UUIDs
  [+] State machine transitions strictly enforced on live PostgreSQL data
  [+] Database health check dynamically reports live status & latency
```
