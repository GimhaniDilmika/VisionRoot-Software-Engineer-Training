# Day 05 - Backend API Test Results

**Executed:** 2026-11-13 21:33:00
**Environment:** Development (in-memory store)
**Server:** http://localhost:5000
**Branch:** feature/day-05-backend-api-service-layer

---

## Summary

| Result | Count |
|--------|-------|
| PASS   | 27 |
| FAIL   | 0 |
| Total  | 27 |

---

## [+] 1. Health endpoint
```
GET http://localhost:5000/api/health

HTTP Status: 200
Response:
{
    "success":  true,
    "data":  {
                 "status":  "healthy",
                 "uptime_seconds":  26.9,
                 "timestamp":  "2026-11-13T16:02:59.205Z",
                 "environment":  "development",
                 "database":  {
                                  "status":  "not_configured",
                                  "note":  "PostgreSQL integration deferred to Day 06. Using in-memory store."
                              }
             }
}

Result: PASS (expected 200)
```

## [+] 2. List all requests (5 seed records)
```
GET http://localhost:5000/api/requests

HTTP Status: 200
Response:
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

Result: PASS (expected 200)
```

## [+] 3. Get request by ID
```
GET http://localhost:5000/api/requests/550e8400-e29b-41d4-a716-446655440000

HTTP Status: 200
Response:
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

Result: PASS (expected 200)
```

## [+] 4. Create valid request (all fields)
```
POST http://localhost:5000/api/requests
Body: {"title":"Network switch reboot needed","description":"The network switch on floor 2 needs rebooting after firmware update","category":"IT","priority":"HIGH"}

HTTP Status: 201
Response:
{
    "success":  true,
    "data":  {
                 "id":  "e63363d4-c47a-48ce-9faf-ac759db9087e",
                 "title":  "Network switch reboot needed",
                 "description":  "The network switch on floor 2 needs rebooting after firmware update",
                 "category":  "IT",
                 "priority":  "HIGH",
                 "status":  "OPEN",
                 "created_at":  "2026-11-13T16:02:59.359Z",
                 "updated_at":  "2026-11-13T16:02:59.359Z"
             }
}

Result: PASS (expected 201)
```

## [+] 5. Create with default priority (MEDIUM)
```
POST http://localhost:5000/api/requests
Body: {"title":"Broken window latch in Room 101","description":"The window latch in Room 101 is broken and cannot be secured properly","category":"Facilities"}

HTTP Status: 201
Response:
{
    "success":  true,
    "data":  {
                 "id":  "bd9feb35-2b43-4603-b4f4-2e7b89a704f8",
                 "title":  "Broken window latch in Room 101",
                 "description":  "The window latch in Room 101 is broken and cannot be secured properly",
                 "category":  "Facilities",
                 "priority":  "MEDIUM",
                 "status":  "OPEN",
                 "created_at":  "2026-11-13T16:02:59.399Z",
                 "updated_at":  "2026-11-13T16:02:59.399Z"
             }
}

Result: PASS (expected 201)
```

## [+] 6. Missing title
```
POST http://localhost:5000/api/requests
Body: {"description":"A valid description here that is long enough","category":"IT"}

HTTP Status: 400
Response:
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
    "timestamp":  "2026-11-13T16:02:59.445Z"
}

Result: PASS (expected 400)
```

## [+] 7. Title too short
```
POST http://localhost:5000/api/requests
Body: {"title":"Hi","description":"A valid description here that is long enough","category":"IT"}

HTTP Status: 400
Response:
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
    "timestamp":  "2026-11-13T16:02:59.477Z"
}

Result: PASS (expected 400)
```

## [+] 8. Missing description
```
POST http://localhost:5000/api/requests
Body: {"title":"Valid title here for test","category":"IT"}

HTTP Status: 400
Response:
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
    "timestamp":  "2026-11-13T16:02:59.503Z"
}

Result: PASS (expected 400)
```

## [+] 9. Description too short
```
POST http://localhost:5000/api/requests
Body: {"title":"Valid title here for test","description":"Short","category":"IT"}

HTTP Status: 400
Response:
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
    "timestamp":  "2026-11-13T16:02:59.527Z"
}

Result: PASS (expected 400)
```

## [+] 10. Missing category
```
POST http://localhost:5000/api/requests
Body: {"title":"Valid title here for test","description":"A valid description here that is long enough"}

HTTP Status: 400
Response:
{
    "success":  false,
    "error":  {
                  "code":  "VALIDATION_ERROR",
                  "message":  "Invalid request payload",
                  "details":  [
                                  {
                                      "field":  "category",
                                      "message":  "Category is required"
                                  }
                              ]
              },
    "timestamp":  "2026-11-13T16:02:59.552Z"
}

Result: PASS (expected 400)
```

## [+] 11. Invalid category
```
POST http://localhost:5000/api/requests
Body: {"title":"Valid title here for test","description":"A valid description here that is long enough","category":"INVALID"}

HTTP Status: 400
Response:
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
    "timestamp":  "2026-11-13T16:02:59.579Z"
}

Result: PASS (expected 400)
```

## [+] 12. Invalid priority
```
POST http://localhost:5000/api/requests
Body: {"title":"Valid title here for test","description":"A valid description here that is long enough","category":"IT","priority":"URGENT"}

HTTP Status: 400
Response:
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
    "timestamp":  "2026-11-13T16:02:59.606Z"
}

Result: PASS (expected 400)
```

## [+] 13. Empty body
```
POST http://localhost:5000/api/requests
Body: {}

HTTP Status: 400
Response:
{
    "success":  false,
    "error":  {
                  "code":  "VALIDATION_ERROR",
                  "message":  "Invalid request payload",
                  "details":  [
                                  {
                                      "field":  "title",
                                      "message":  "Title is required and cannot be blank"
                                  },
                                  {
                                      "field":  "description",
                                      "message":  "Description is required"
                                  },
                                  {
                                      "field":  "category",
                                      "message":  "Category is required"
                                  }
                              ]
              },
    "timestamp":  "2026-11-13T16:02:59.644Z"
}

Result: PASS (expected 400)
```

## [+] 14. Invalid UUID format (GET)
```
GET http://localhost:5000/api/requests/abc-123

HTTP Status: 400
Response:
{
    "success":  false,
    "error":  {
                  "code":  "INVALID_IDENTIFIER",
                  "message":  "The provided request ID \u0027abc-123\u0027 is not a valid UUID"
              },
    "timestamp":  "2026-11-13T16:02:59.693Z"
}

Result: PASS (expected 400)
```

## [+] 15. Unknown UUID (GET)
```
GET http://localhost:5000/api/requests/00000000-0000-0000-0000-000000000000

HTTP Status: 404
Response:
{
    "success":  false,
    "error":  {
                  "code":  "NOT_FOUND",
                  "message":  "Service request with ID \u002700000000-0000-0000-0000-000000000000\u0027 was not found"
              },
    "timestamp":  "2026-11-13T16:02:59.735Z"
}

Result: PASS (expected 404)
```

## [+] 16. Invalid UUID format (PATCH)
```
PATCH http://localhost:5000/api/requests/not-a-uuid/status
Body: {"status":"IN_PROGRESS"}

HTTP Status: 400
Response:
{
    "success":  false,
    "error":  {
                  "code":  "INVALID_IDENTIFIER",
                  "message":  "The provided request ID \u0027not-a-uuid\u0027 is not a valid UUID"
              },
    "timestamp":  "2026-11-13T16:02:59.781Z"
}

Result: PASS (expected 400)
```

## [+] 17. Unknown UUID (PATCH)
```
PATCH http://localhost:5000/api/requests/00000000-0000-0000-0000-000000000000/status
Body: {"status":"IN_PROGRESS"}

HTTP Status: 404
Response:
{
    "success":  false,
    "error":  {
                  "code":  "NOT_FOUND",
                  "message":  "Service request with ID \u002700000000-0000-0000-0000-000000000000\u0027 was not found"
              },
    "timestamp":  "2026-11-13T16:02:59.815Z"
}

Result: PASS (expected 404)
```

## [+] 18. OPEN -> IN_PROGRESS
```
PATCH http://localhost:5000/api/requests/550e8400-e29b-41d4-a716-446655440000/status
Body: {"status":"IN_PROGRESS"}

HTTP Status: 200
Response:
{
    "success":  true,
    "data":  {
                 "id":  "550e8400-e29b-41d4-a716-446655440000",
                 "title":  "Flickering monitor on Desk 12",
                 "description":  "The external monitor turns black intermittently when connected via HDMI cable to MacBook Pro.",
                 "category":  "IT",
                 "priority":  "HIGH",
                 "status":  "IN_PROGRESS",
                 "created_at":  "2026-11-12T04:10:00.000Z",
                 "updated_at":  "2026-11-13T16:02:59.862Z"
             }
}

Result: PASS (expected 200)
```

## [+] 19. IN_PROGRESS -> RESOLVED
```
PATCH http://localhost:5000/api/requests/550e8400-e29b-41d4-a716-446655440000/status
Body: {"status":"RESOLVED"}

HTTP Status: 200
Response:
{
    "success":  true,
    "data":  {
                 "id":  "550e8400-e29b-41d4-a716-446655440000",
                 "title":  "Flickering monitor on Desk 12",
                 "description":  "The external monitor turns black intermittently when connected via HDMI cable to MacBook Pro.",
                 "category":  "IT",
                 "priority":  "HIGH",
                 "status":  "RESOLVED",
                 "created_at":  "2026-11-12T04:10:00.000Z",
                 "updated_at":  "2026-11-13T16:02:59.886Z"
             }
}

Result: PASS (expected 200)
```

## [+] 20. RESOLVED -> CLOSED
```
PATCH http://localhost:5000/api/requests/550e8400-e29b-41d4-a716-446655440000/status
Body: {"status":"CLOSED"}

HTTP Status: 200
Response:
{
    "success":  true,
    "data":  {
                 "id":  "550e8400-e29b-41d4-a716-446655440000",
                 "title":  "Flickering monitor on Desk 12",
                 "description":  "The external monitor turns black intermittently when connected via HDMI cable to MacBook Pro.",
                 "category":  "IT",
                 "priority":  "HIGH",
                 "status":  "CLOSED",
                 "created_at":  "2026-11-12T04:10:00.000Z",
                 "updated_at":  "2026-11-13T16:02:59.909Z"
             }
}

Result: PASS (expected 200)
```

## [+] 21. IN_PROGRESS -> CLOSED (must reject)
```
PATCH http://localhost:5000/api/requests/6ba7b810-9dad-11d1-80b4-00c04fd430c8/status
Body: {"status":"CLOSED"}

HTTP Status: 400
Response:
{
    "success":  false,
    "error":  {
                  "code":  "INVALID_STATE_TRANSITION",
                  "message":  "Cannot transition request from \u0027IN_PROGRESS\u0027 directly to \u0027CLOSED\u0027. Allowed target statuses: \u0027RESOLVED\u0027."
              },
    "timestamp":  "2026-11-13T16:02:59.951Z"
}

Result: PASS (expected 400)
```

## [+] 22. IN_PROGRESS -> OPEN (must reject)
```
PATCH http://localhost:5000/api/requests/6ba7b810-9dad-11d1-80b4-00c04fd430c8/status
Body: {"status":"OPEN"}

HTTP Status: 400
Response:
{
    "success":  false,
    "error":  {
                  "code":  "INVALID_STATE_TRANSITION",
                  "message":  "Cannot transition request from \u0027IN_PROGRESS\u0027 directly to \u0027OPEN\u0027. Allowed target statuses: \u0027RESOLVED\u0027."
              },
    "timestamp":  "2026-11-13T16:02:59.997Z"
}

Result: PASS (expected 400)
```

## [+] 23. CLOSED -> OPEN (terminal, must reject)
```
PATCH http://localhost:5000/api/requests/9ea7b810-9dad-11d1-80b4-00c04fd430d1/status
Body: {"status":"OPEN"}

HTTP Status: 400
Response:
{
    "success":  false,
    "error":  {
                  "code":  "INVALID_STATE_TRANSITION",
                  "message":  "Cannot modify a service request that is already in terminal \u0027CLOSED\u0027 status."
              },
    "timestamp":  "2026-11-13T16:03:00.055Z"
}

Result: PASS (expected 400)
```

## [+] 24. Invalid status value
```
PATCH http://localhost:5000/api/requests/6ba7b810-9dad-11d1-80b4-00c04fd430c8/status
Body: {"status":"INVALID"}

HTTP Status: 400
Response:
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
    "timestamp":  "2026-11-13T16:03:00.084Z"
}

Result: PASS (expected 400)
```

## [+] 25. Filter by status=OPEN
```
GET http://localhost:5000/api/requests?status=OPEN

HTTP Status: 200
Response:
{
    "success":  true,
    "data":  [
                 {
                     "id":  "bd9feb35-2b43-4603-b4f4-2e7b89a704f8",
                     "title":  "Broken window latch in Room 101",
                     "description":  "The window latch in Room 101 is broken and cannot be secured properly",
                     "category":  "Facilities",
                     "priority":  "MEDIUM",
                     "status":  "OPEN",
                     "created_at":  "2026-11-13T16:02:59.399Z",
                     "updated_at":  "2026-11-13T16:02:59.399Z"
                 },
                 {
                     "id":  "e63363d4-c47a-48ce-9faf-ac759db9087e",
                     "title":  "Network switch reboot needed",
                     "description":  "The network switch on floor 2 needs rebooting after firmware update",
                     "category":  "IT",
                     "priority":  "HIGH",
                     "status":  "OPEN",
                     "created_at":  "2026-11-13T16:02:59.359Z",
                     "updated_at":  "2026-11-13T16:02:59.359Z"
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

Result: PASS (expected 200)
```

## [+] 26. Filter by invalid status
```
GET http://localhost:5000/api/requests?status=INVALID

HTTP Status: 400
Response:
{
    "success":  false,
    "error":  {
                  "code":  "VALIDATION_ERROR",
                  "message":  "Invalid query parameter \u0027status\u0027",
                  "details":  [
                                  {
                                      "field":  "status",
                                      "message":  "Status must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED"
                                  }
                              ]
              },
    "timestamp":  "2026-11-13T16:03:00.164Z"
}

Result: PASS (expected 400)
```

## [+] 27. Unknown route returns 404
```
GET http://localhost:5000/api/nonexistent

HTTP Status: 404
Response:
{
    "success":  false,
    "error":  {
                  "code":  "NOT_FOUND",
                  "message":  "The requested endpoint GET /api/nonexistent does not exist"
              },
    "timestamp":  "2026-11-13T16:03:00.197Z"
}

Result: PASS (expected 404)
```

---

## State Machine Verification

```
Strict Linear Lifecycle:
  OPEN -> IN_PROGRESS -> RESOLVED -> CLOSED

Tests Verified:
  [+] OPEN -> IN_PROGRESS (allowed)
  [+] IN_PROGRESS -> RESOLVED (allowed)
  [+] RESOLVED -> CLOSED (allowed)
  [+] IN_PROGRESS -> CLOSED (REJECTED - bug fix confirmed)
  [+] IN_PROGRESS -> OPEN (REJECTED - no backward transitions)
  [+] CLOSED -> OPEN (REJECTED - terminal state)
  [+] Invalid status value (REJECTED - validation error)
```
