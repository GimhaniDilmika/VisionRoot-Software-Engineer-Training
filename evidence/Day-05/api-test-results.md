# Day 05 — Backend API Test Results

**Executed:** 2026-11-13 16:45:39
**Environment:** Development (in-memory store)
**Server:** http://localhost:5000
## Test 1: Health Endpoint
```
GET http://localhost:5000/api/health

HTTP Status: 200
Response:
{
    "success":  true,
    "data":  {
                 "status":  "healthy",
                 "uptime_seconds":  87.5,
                 "timestamp":  "2026-11-13T11:15:37.754Z",
                 "environment":  "development",
                 "database":  {
                                  "status":  "not_configured",
                                  "note":  "PostgreSQL integration deferred to Day 06. Using in-memory store."
                              }
             }
}
Result: PASS (expected 200)
```

## Test 2: List All Requests
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

## Test 3: Get Request by ID
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

## Test 4: Create Valid Request
```
POST http://localhost:5000/api/requests
Body: {"title":"Network switch reboot needed","description":"The network switch on floor 2 needs rebooting after firmware update","category":"IT","priority":"HIGH"}

HTTP Status: 201
Response:
{
    "success":  true,
    "data":  {
                 "id":  "da2325af-ca49-4728-a556-ffe6eb70c918",
                 "title":  "Network switch reboot needed",
                 "description":  "The network switch on floor 2 needs rebooting after firmware update",
                 "category":  "IT",
                 "priority":  "HIGH",
                 "status":  "OPEN",
                 "created_at":  "2026-11-13T11:15:38.670Z",
                 "updated_at":  "2026-11-13T11:15:38.670Z"
             }
}
Result: PASS (expected 201)
```

## Test 5: Create Request (default priority)
```
POST http://localhost:5000/api/requests
Body: {"title":"Broken window latch in Room 101","description":"The window latch in Room 101 is broken and cannot be secured"}

HTTP Status: 400
Response:

Result: FAIL (expected 400, got 400)
```

## Test 5b: Create with all fields
```
POST http://localhost:5000/api/requests
Body: {"title":"Broken window latch in Room 101","description":"The window latch in Room 101 is broken and cannot be secured properly","category":"Facilities"}

HTTP Status: 201
Response:
{
    "success":  true,
    "data":  {
                 "id":  "e1862fbe-45c2-4a6a-8d48-a72955e32dc1",
                 "title":  "Broken window latch in Room 101",
                 "description":  "The window latch in Room 101 is broken and cannot be secured properly",
                 "category":  "Facilities",
                 "priority":  "MEDIUM",
                 "status":  "OPEN",
                 "created_at":  "2026-11-13T11:15:39.053Z",
                 "updated_at":  "2026-11-13T11:15:39.053Z"
             }
}
Result: PASS (expected 201)
```

## Test 6: PATCH OPEN to IN_PROGRESS
```
PATCH http://localhost:5000/api/requests/7ca7b810-9dad-11d1-80b4-00c04fd430c9/status
Body: {"status":"IN_PROGRESS"}

HTTP Status: 200
Response:
{
    "success":  true,
    "data":  {
                 "id":  "7ca7b810-9dad-11d1-80b4-00c04fd430c9",
                 "title":  "VPN access requested for remote finance audit",
                 "description":  "Require secure global VPN provisioning for the external quarterly finance auditing team.",
                 "category":  "IT",
                 "priority":  "MEDIUM",
                 "status":  "IN_PROGRESS",
                 "created_at":  "2026-11-12T02:15:00.000Z",
                 "updated_at":  "2026-11-13T11:15:39.076Z"
             }
}
Result: PASS (expected 200)
```

## Test 7: PATCH IN_PROGRESS to RESOLVED
```
PATCH http://localhost:5000/api/requests/7ca7b810-9dad-11d1-80b4-00c04fd430c9/status
Body: {"status":"RESOLVED"}

HTTP Status: 200
Response:
{
    "success":  true,
    "data":  {
                 "id":  "7ca7b810-9dad-11d1-80b4-00c04fd430c9",
                 "title":  "VPN access requested for remote finance audit",
                 "description":  "Require secure global VPN provisioning for the external quarterly finance auditing team.",
                 "category":  "IT",
                 "priority":  "MEDIUM",
                 "status":  "RESOLVED",
                 "created_at":  "2026-11-12T02:15:00.000Z",
                 "updated_at":  "2026-11-13T11:15:39.096Z"
             }
}
Result: PASS (expected 200)
```

## Test 8: PATCH RESOLVED to CLOSED
```
PATCH http://localhost:5000/api/requests/7ca7b810-9dad-11d1-80b4-00c04fd430c9/status
Body: {"status":"CLOSED"}

HTTP Status: 200
Response:
{
    "success":  true,
    "data":  {
                 "id":  "7ca7b810-9dad-11d1-80b4-00c04fd430c9",
                 "title":  "VPN access requested for remote finance audit",
                 "description":  "Require secure global VPN provisioning for the external quarterly finance auditing team.",
                 "category":  "IT",
                 "priority":  "MEDIUM",
                 "status":  "CLOSED",
                 "created_at":  "2026-11-12T02:15:00.000Z",
                 "updated_at":  "2026-11-13T11:15:39.113Z"
             }
}
Result: PASS (expected 200)
```

## Test 9: GET request after full lifecycle
```
GET http://localhost:5000/api/requests/7ca7b810-9dad-11d1-80b4-00c04fd430c9

HTTP Status: 200
Response:
{
    "success":  true,
    "data":  {
                 "id":  "7ca7b810-9dad-11d1-80b4-00c04fd430c9",
                 "title":  "VPN access requested for remote finance audit",
                 "description":  "Require secure global VPN provisioning for the external quarterly finance auditing team.",
                 "category":  "IT",
                 "priority":  "MEDIUM",
                 "status":  "CLOSED",
                 "created_at":  "2026-11-12T02:15:00.000Z",
                 "updated_at":  "2026-11-13T11:15:39.113Z"
             }
}
Result: PASS (expected 200)
```

## Test 10: Filter by status=OPEN
```
GET http://localhost:5000/api/requests?status=OPEN

HTTP Status: 200
Response:
{
    "success":  true,
    "data":  [
                 {
                     "id":  "e1862fbe-45c2-4a6a-8d48-a72955e32dc1",
                     "title":  "Broken window latch in Room 101",
                     "description":  "The window latch in Room 101 is broken and cannot be secured properly",
                     "category":  "Facilities",
                     "priority":  "MEDIUM",
                     "status":  "OPEN",
                     "created_at":  "2026-11-13T11:15:39.053Z",
                     "updated_at":  "2026-11-13T11:15:39.053Z"
                 },
                 {
                     "id":  "da2325af-ca49-4728-a556-ffe6eb70c918",
                     "title":  "Network switch reboot needed",
                     "description":  "The network switch on floor 2 needs rebooting after firmware update",
                     "category":  "IT",
                     "priority":  "HIGH",
                     "status":  "OPEN",
                     "created_at":  "2026-11-13T11:15:38.670Z",
                     "updated_at":  "2026-11-13T11:15:38.670Z"
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
                 }
             ]
}
Result: PASS (expected 200)
```

## Test 11: Missing title
```
POST http://localhost:5000/api/requests
Body: {"description":"A valid description here","category":"IT"}

HTTP Status: 400
Response:

Result: FAIL (expected 400, got 400)
```

## Test 12: Title too short
```
POST http://localhost:5000/api/requests
Body: {"title":"Hi","description":"A valid description here","category":"IT"}

HTTP Status: 400
Response:

Result: FAIL (expected 400, got 400)
```

## Test 13: Invalid category
```
POST http://localhost:5000/api/requests
Body: {"title":"Valid title here","description":"A valid description here","category":"INVALID"}

HTTP Status: 400
Response:

Result: FAIL (expected 400, got 400)
```

## Test 14: Invalid priority
```
POST http://localhost:5000/api/requests
Body: {"title":"Valid title here","description":"A valid description here","category":"IT","priority":"URGENT"}

HTTP Status: 400
Response:

Result: FAIL (expected 400, got 400)
```

## Test 15: Missing description
```
POST http://localhost:5000/api/requests
Body: {"title":"Valid title here","category":"IT"}

HTTP Status: 400
Response:

Result: FAIL (expected 400, got 400)
```

## Test 16: Description too short
```
POST http://localhost:5000/api/requests
Body: {"title":"Valid title here","description":"Short","category":"IT"}

HTTP Status: 400
Response:

Result: FAIL (expected 400, got 400)
```

## Test 17: Invalid ID format
```
GET http://localhost:5000/api/requests/abc-123

HTTP Status: 400
Response:

Result: FAIL (expected 400, got 400)
```

## Test 18: Unknown request ID
```
GET http://localhost:5000/api/requests/00000000-0000-0000-0000-000000000000

HTTP Status: 404
Response:

Result: FAIL (expected 404, got 404)
```

## Test 19: BUG FIX — IN_PROGRESS to CLOSED (must reject)
```
PATCH http://localhost:5000/api/requests/6ba7b810-9dad-11d1-80b4-00c04fd430c8/status
Body: {"status":"CLOSED"}

HTTP Status: 400
Response:

Result: FAIL (expected 400, got 400)
```

## Test 20: OPEN to RESOLVED (must reject)
```
PATCH http://localhost:5000/api/requests/550e8400-e29b-41d4-a716-446655440000/status
Body: {"status":"RESOLVED"}

HTTP Status: 400
Response:

Result: FAIL (expected 400, got 400)
```

## Test 21: OPEN to CLOSED (must reject)
```
PATCH http://localhost:5000/api/requests/550e8400-e29b-41d4-a716-446655440000/status
Body: {"status":"CLOSED"}

HTTP Status: 400
Response:

Result: FAIL (expected 400, got 400)
```

## Test 22: Transition from CLOSED (terminal)
```
PATCH http://localhost:5000/api/requests/9ea7b810-9dad-11d1-80b4-00c04fd430d1/status
Body: {"status":"OPEN"}

HTTP Status: 400
Response:

Result: FAIL (expected 400, got 400)
```

## Test 23: Invalid status value
```
PATCH http://localhost:5000/api/requests/550e8400-e29b-41d4-a716-446655440000/status
Body: {"status":"INVALID"}

HTTP Status: 400
Response:

Result: FAIL (expected 400, got 400)
```

## Test 24: Unknown route
```
GET http://localhost:5000/api/nonexistent

HTTP Status: 404
Response:

Result: FAIL (expected 404, got 404)
```

## Test 25: PATCH with invalid UUID
```
PATCH http://localhost:5000/api/requests/not-a-uuid/status
Body: {"status":"IN_PROGRESS"}

HTTP Status: 400
Response:

Result: FAIL (expected 400, got 400)
```

## Test 26: PATCH unknown request
```
PATCH http://localhost:5000/api/requests/00000000-0000-0000-0000-000000000000/status
Body: {"status":"IN_PROGRESS"}

HTTP Status: 404
Response:

Result: FAIL (expected 404, got 404)
```

---

# Day 05 API Test Results Summary

**Date:** 2026-11-13 16:45:39
**Server:** http://localhost:5000
**Branch:** feature/day-05-backend-api-service-layer

| Result | Count |
|--------|-------|
| PASS   | 10 |
| FAIL   | 17 |
| Total  | 27 |
