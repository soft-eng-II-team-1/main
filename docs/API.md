# API specification - Get Ticket

## `GET /services`

Returns a list of all services a customer can choose from

### Response `200 OK`

```json
[
  { "id": "...", "name": "Shipping" },
  { "id": "...", "name": "Accounts" }
]
```

An empty list is a valid response (no service available)

### Errors
| Status | Situation |
|------------|---------|
| 500 | Unexpected server or database error |

## `POST /tickets`

Creates a ticket for the selected service. The ticket is created in state `PENDING` and enters a queue for that service.

### Request body

```json
{ "serviceId": "..." }
```

### Response `201 Created`
 
```json
{
  "id": "...",
  "number": "...",
  "state": "PENDING",
  "serviceId": "...",
  "serviceName": "Shipping",
  "issuedAt": "2026-10-06T08:15:30.000Z"
}
```

### Errors
| Status | Situation |
|------------|---------|
| 400 | Body is not valid json |
| 404 | Service not found |
| 415 | `Content-Type` is not `application/json` |
| 422 | Body is valid JSON but `serviceId` is missing or not the right type |
| 500 | Unexpected server or database error |

## `GET /tickets/queues`

Returns the active queues of tickets currently in `PENDING` state, grouped by service.

### Response `200 OK`

```json
{
  "Shipping": {
    "avgTime": 600,
    "tickets": [
      { "id": "e9c9c819-0123-4567-89ab-cdef01234567", "number": "1", "state": "PENDING", "issuedAt": "2026-10-07T08:15:30.000Z" }
    ]
  },
  "Accounts": {
    "avgTime": 500,
    "tickets": []
  }
}
```

### Errors
| Status | Situation |
|------------|---------|
| 500 | Unexpected server or database error |

# API specification - Next Customer

## `GET /counters/:counterId/next`

Returns the next ticket for a specific counter, moving the queues.

### Response `200 OK`

```json
{
  "id": "...",
  "number": "...",
  "state": "CALLED",
  "serviceId": "...",
  "serviceName": "Shipping",
  "issuedAt": "2026-10-06T08:15:30.000Z"
}
```

An empty ticket is a valid response (the queues are empty)

### Errors
| Status | Situation |
|------------|---------|
| 404 | Counter not found |
| 500 | Unexpected server or database error |