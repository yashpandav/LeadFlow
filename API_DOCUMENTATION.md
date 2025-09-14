# Backend API Documentation

This document provides a comprehensive guide to the backend API of the application. It covers all available endpoints, their functionalities, request/response formats, and authentication requirements.

## Base URL

All API endpoints are prefixed with the base URL: `/api`

---

## Authentication (`/api/auth`)

Handles user registration, login, and logout.

### `POST /auth/register`

Registers a new user in the system.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "Password123!"
}
```

**Validation Rules:**
- `name`: String, required.
- `email`: String, required, must be a valid email format.
- `password`: String, required, must be at least 6 characters long, and contain at least one uppercase letter, one number, and one special character (`!@#$%^&*`).

**Responses:**
- `201 Created`: User registered successfully.
  ```json
  {
    "success": true,
    "message": "User registered successfully"
  }
  ```
- `400 Bad Request`: If validation fails or the email already exists.
- `500 Internal Server Error`: Server-side error.

---

### `POST /auth/login`

Authenticates a user and returns a JWT token.

**Request Body:**

```json
{
  "email": "john.doe@example.com",
  "password": "Password123!"
}
```

**Validation Rules:**
- `email`: String, required, must be a valid email format.
- `password`: String, required, same validation as registration.

**Responses:**
- `200 OK`: Login successful.
  ```json
  {
    "success": true,
    "token": "your_jwt_token",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "User",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "message": "Login successful"
  }
  ```
- `400 Bad Request`: If validation fails.
- `401 Unauthorized`: Invalid credentials.
- `500 Internal Server Error`: Server-side error.

---

### `POST /auth/logout`

Logs out the user. (Note: On the backend, this is a placeholder and doesn't invalidate the token. Token invalidation should be handled client-side by deleting the token).

**Responses:**
- `200 OK`: Logout successful.
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```
- `500 Internal Server Error`: Server-side error.

---
---

## Customers (`/api/customers`)

Endpoints for managing customer data. **All endpoints require authentication.**

### `GET /customers`

Retrieves a paginated list of customers belonging to the authenticated user.

**Query Parameters:**
- `page` (optional): The page number to retrieve. Defaults to `1`.
- `limit` (optional): The number of customers per page. Defaults to `10`.

**Responses:**
- `200 OK`: Returns an array of customer objects and pagination details.
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "customer_id",
        "name": "Customer Name",
        "email": "customer@example.com",
        "phone": "123-456-7890",
        "company": "Customer Inc.",
        "ownerId": "user_id",
        "totalLeads": 2
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "pages": 2
    }
  }
  ```
- `500 Internal Server Error`: Server-side error.

---

### `POST /customers`

Adds a new customer for the authenticated user.

**Request Body:**

```json
{
  "name": "New Customer",
  "email": "new.customer@example.com",
  "phone": "987-654-3210",
  "company": "NewCo"
}
```

**Validation Rules:**
- `name`: String, required.
- `email`: String, required, must be a valid email format.
- `phone`: String, optional.
- `company`: String, optional.

**Responses:**
- `201 Created`: Customer created successfully. Returns the new customer object.
- `400 Bad Request`: If validation fails.
- `500 Internal Server Error`: Server-side error.

---

### `GET /customers/:id`

Retrieves a single customer by its ID. The user must be the owner of the customer.

**Responses:**
- `200 OK`: Returns the customer object.
- `404 Not Found`: If the customer with the given ID doesn't exist or doesn't belong to the user.
- `500 Internal Server Error`: Server-side error.

---

### `PUT /customers/:id`

Updates a customer's information. The user must be the owner of the customer.

**Request Body:** (Same as `POST /customers`)

**Validation Rules:** (Same as `POST /customers`)

**Responses:**
- `200 OK`: Customer updated successfully. Returns the updated customer object.
- `400 Bad Request`: If validation fails.
- `404 Not Found`: If the customer doesn't exist or doesn't belong to the user.
- `500 Internal Server Error`: Server-side error.

---

### `DELETE /customers/:id`

Deletes a customer and **all associated leads**. The user must be the owner of the customer.

**Responses:**
- `200 OK`: Customer deleted successfully.
- `404 Not Found`: If the customer doesn't exist or doesn't belong to the user.
- `500 Internal Server Error`: Server-side error.

---
---

## Leads (`/api/leads`)

Endpoints for managing leads. **All endpoints require authentication.**

### `GET /leads`

Retrieves a paginated list of all leads from all customers belonging to the authenticated user.

**Query Parameters:**
- `page` (optional): The page number to retrieve. Defaults to `1`.
- `limit` (optional): The number of leads per page. Defaults to `10`.

**Responses:**
- `200 OK`: Returns an array of lead objects and pagination details.
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "lead_id",
        "customerId": {
            "_id": "customer_id",
            "name": "Customer Name"
        },
        "title": "New Website Project",
        "description": "...",
        "status": "New",
        "value": 5000
      }
    ],
    "totalPages": 5,
    "currentPage": "1"
  }
  ```
- `400 Bad Request`: Server-side error (as per controller).

---

### `POST /leads`

Adds a new lead for a specific customer. The user must own the customer.

**Request Body:**

```json
{
  "customerId": "customer_id",
  "title": "Initial Inquiry",
  "description": "Customer is interested in our services.",
  "status": "New",
  "value": 1500
}
```

**Validation Rules:**
- `customerId`: String, required.
- `title`: String, required.
- `description`: String, optional.
- `status`: String, optional, must be one of `['New', 'Contacted', 'Converted', 'Lost']`. Defaults to `New`.
- `value`: Number, optional.

**Responses:**
- `201 Created`: Lead created successfully. Returns the new lead object, populated with customer name.
- `400 Bad Request`: If validation fails.
- `404 Not Found`: If the specified `customerId` does not belong to the user.

---

### `GET /leads/:id`

Retrieves all leads for a specific customer. Note: The `:id` in the path is the **customer ID**.

**Responses:**
- `200 OK`: Returns an array of lead objects for the specified customer.
- `404 Not Found`: If the customer doesn't exist or doesn't belong to the user.
- `400 Bad Request`: Server-side error (as per controller).

---

### `PUT /leads/:id`

Updates a lead's information. The user must own the customer associated with the lead. The `:id` is the **lead ID**.

**Middleware:** `authorizeLeadAccess`

**Request Body:**

```json
{
  "title": "Follow-up Meeting",
  "status": "Contacted",
  "value": 2000
}
```

**Validation Rules:**
- Fields are optional, but if provided, they must conform to the lead schema (e.g., `status` must be a valid enum).

**Responses:**
- `200 OK`: Lead updated successfully. Returns the updated lead object.
- `400 Bad Request`: If validation fails.
- `403 Forbidden`: If the user is not authorized to access this lead.
- `404 Not Found`: If the lead is not found.

---

### `DELETE /leads/:id`

Deletes a lead by its ID. The user must own the customer associated with the lead. The `:id` is the **lead ID**.

**Middleware:** `authorizeLeadAccess`

**Responses:**
- `200 OK`: Lead deleted successfully.
- `403 Forbidden`: If the user is not authorized to access this lead.
- `404 Not Found`: If the lead is not found.

---
---

## Dashboard (`/api/dashboard`)

Endpoint for retrieving dashboard statistics. **Requires authentication.**

### `GET /dashboard`

Fetches aggregated data and statistics for the authenticated user's dashboard.

**Responses:**
- `200 OK`: Returns a comprehensive object of dashboard stats.
  ```json
  {
    "success": true,
    "data": {
      "totalCustomers": 50,
      "totalLeads": 120,
      "convertedLeads": 30,
      "newCustomers": 5,
      "leadConversionRate": 25,
      "recentLeads": [ /* ... */ ],
      "leadsByStatus": [ /* ... */ ],
      "topCustomers": [ /* ... */ ],
      "leadsOverTime": [ /* ... */ ]
    }
  }
  ```
- `500 Internal Server Error`: Server-side error.

---
---

## Reports (`/api/reports`)

Endpoint for generating reports. **Requires authentication.**

### `GET /reports`

Generates and retrieves various reports based on the user's data.

**Query Parameters:**
- `dateRange` (optional): Filters the report data by a time period. Can be `last7days`, `last30days`, or `thisYear`.

**Responses:**
- `200 OK`: Returns an object containing different report datasets.
  ```json
  {
    "success": true,
    "data": {
        "customers": [ /* ... */ ],
        "leads": [ /* ... */ ],
        "leadsByStatus": [ /* ... */ ],
        "leadConversionFunnel": [ /* ... */ ],
        "leadValueByStatus": [ /* ... */ ],
        "customerGrowth": [ /* ... */ ],
        "topCustomersByLeadValue": [ /* ... */ ]
    }
  }
  ```
- `500 Internal Server Error`: Server-side error.

---
---

## Middleware

### `protect`

This middleware is applied to all routes that require an authenticated user. It validates the JWT `Authorization` header (`Bearer <token>`). If the token is missing or invalid, it returns a `401 Unauthorized` error.

### `authorizeLeadAccess`

This middleware is used on `PUT` and `DELETE` lead routes (`/api/leads/:id`). It ensures that the authenticated user is the owner of the customer to which the lead belongs, preventing unauthorized modifications. If the check fails, it returns a `403 Forbidden` error.
