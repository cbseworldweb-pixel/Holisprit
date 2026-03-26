# User API Documentation

> Complete API reference for **frontend developers** integrating with the Holisprit OTT platform.

---

## Table of Contents

1. [Base Configuration](#base-configuration)
2. [Authentication](#authentication)
3. [Movies](#movies)
4. [User Profile](#user-profile)
5. [Payments & Purchases](#payments--purchases)
6. [Categories & Tags](#categories--tags)
7. [Error Handling](#error-handling)

---

## Base Configuration

### Base URL
```
https://dummy-nj2d.onrender.com/api
```

### Headers
All requests must include:
```
Content-Type: application/json
```

### Authentication Token
Protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Authentication

### 1. Register User
**NEW: Email/Password Registration**

**Endpoint:** `POST /auth/register`

**Public Access:** ✅ (No token required)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "User@123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "USER_ID",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "JWT_TOKEN"
  }
}
```

**Error Codes:**
- `400` - Invalid input format
- `409` - Email already registered

---

### 2. Login with Email
**NEW: Email/Password Login**

**Endpoint:** `POST /auth/login`

**Public Access:** ✅ (No token required)

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "User@123"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "USER_ID",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "JWT_TOKEN"
  }
}
```

**Error Codes:**
- `400` - Missing credentials
- `401` - Invalid email or password
- `403` - Account is blocked

---

### 3. Send OTP (Mobile-based auth)
**Endpoint:** `POST /auth/otp/send`

**Public Access:** ✅ (No token required)

**Rate Limit:** 8 requests per minute

**Request Body:**
```json
{
  "mobile": "9876543210",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": {
    "mobile": "9876543210",
    "expiresInSeconds": 300,
    "userExists": false,
    "otp": "123456",          // Development only
    "otpCode": "123456"       // Development only
  }
}
```

**Validation Rules:**
- Mobile: Indian format (10 digits, starts with 6-9)

---

### 4. Verify OTP
**Endpoint:** `POST /auth/otp/verify`

**Public Access:** ✅ (No token required)

**Rate Limit:** 8 requests per minute

**Request Body:**
```json
{
  "mobile": "9876543210",
  "otp": "123456"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": {
    "user": {
      "id": "USER_ID",
      "mobile": "9876543210",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "blocked": false
    },
    "token": "JWT_TOKEN"
  }
}
```

**Error Codes:**
- `400` - Invalid OTP or OTP expired
- `404` - User not found
- `403` - Account is blocked
- `429` - Too many OTP attempts (max 5)

**Note:** OTP validity is 5 minutes

---

### 5. Get Current User
**Endpoint:** `GET /auth/me`

**Protected:** 🔒 (Requires token)

**Response `200`:**
```json
{
  "success": true,
  "message": "User details fetched",
  "user": {
    "id": "USER_ID",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "role": "user",
    "blocked": false
  }
}
```

---

### 6. Demo Login (for testing)
**Endpoint:** `POST /auth/demo/user`

**Public Access:** ✅ (No token required)

**Response:**
```json
{
  "success": true,
  "message": "Demo login successful",
  "data": {
    "user": {
      "id": "DEMO_USER_ID",
      "name": "Demo User",
      "email": "demo@example.com",
      "role": "user"
    },
    "token": "JWT_TOKEN"
  }
}
```

---

## Movies

### 1. List Movies
**Endpoint:** `GET /movies?page=1&limit=20&category=CATEGORY_ID`

**Public Access:** ✅ (No token, but returns purchase status if logged in)

**Query Parameters:**
- `page` (optional) - Page number, default: 1
- `limit` (optional) - Results per page, default: 20, max: 50
- `category` (optional) - Filter by category ID or slug

**Response `200`:**
```json
{
  "success": true,
  "message": "Movies fetched successfully",
  "items": [
    {
      "id": "MOVIE_ID",
      "title": "Movie Title",
      "description": "Movie description...",
      "price": 49.99,
      "isRentable": true,
      "rating": 8.5,
      "language": "Hindi",
      "validityDays": 30,
      "status": "Active",
      "genres": ["Action", "Thriller"],
      "actors": ["Actor1", "Actor2"],
      "coverImageUrl": "https://...",
      "posterUrl": "https://...",
      "categories": [
        {
          "id": "CATEGORY_ID",
          "name": "Action"
        }
      ],
      "chunkCount": 1,
      "totalViews": 1250,
      "totalPurchases": 45,
      "purchaseStatus": {
        "purchased": false,
        "purchaseDate": null,
        "expiryDate": null,
        "status": "not-purchased"
      },
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-15T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Caching:** Results are cached for 30 seconds

---

### 2. Get Movie Details
**Endpoint:** `GET /movies/:movieId`

**Public Access:** ✅ (Returns purchase status if logged in)

**Path Parameters:**
- `movieId` - Movie ID

**Response `200`:**
```json
{
  "success": true,
  "message": "Movie details fetched",
  "data": {
    "id": "MOVIE_ID",
    "title": "Movie Title",
    "description": "Detailed description...",
    "price": 49.99,
    "isRentable": true,
    "rating": 8.5,
    "language": "Hindi",
    "validityDays": 30,
    "status": "Active",
    "genres": ["Action", "Thriller"],
    "actors": ["Actor1", "Actor2"],
    "coverImageUrl": "https://...",
    "posterUrl": "https://...",
    "categories": [
      {
        "id": "CATEGORY_ID",
        "name": "Action"
      }
    ],
    "chunkCount": 1,
    "totalViews": 1250,
    "totalPurchases": 45,
    "purchaseStatus": {
      "purchased": true,
      "purchaseDate": "2025-01-10T12:00:00Z",
      "expiryDate": "2025-02-10T12:00:00Z",
      "status": "paid"
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "updatedAt": "2025-01-15T00:00:00Z"
  }
}
```

**Error Codes:**
- `404` - Movie not found

---

### 3. Watch Purchased Movie
**Endpoint:** `GET /user/watch/:movieId`

**Protected:** 🔒 (Requires token)

**Authorization:** User role

**Response `200`:**
```json
{
  "success": true,
  "message": "Movie access granted",
  "data": {
    "watchLink": "https://cloudinary-video-url.mp4",
    "movieId": "MOVIE_ID",
    "title": "Movie Title",
    "duration": 7200,
    "expiresAt": "2025-02-10T12:00:00Z",
    "watchType": "single-video" // or "multi-part" or "sequential-chunks"
  }
}
```

**Error Codes:**
- `403` - Movie access expired or not purchased
- `404` - Movie not found

---

### 4. Stream Purchased Movie
**Endpoint:** `GET /user/watch/:movieId/stream`

**Protected:** 🔒 (Requires token)

**Authorization:** User role

**Response `200`:**
```json
{
  "success": true,
  "message": "Stream data fetched",
  "data": {
    "watchType": "single-video",
    "playlist": [
      {
        "part": 1,
        "chunkIndex": 0,
        "url": "https://...",
        "size": 5242880
      }
    ],
    "watchLink": "https://..."
  }
}
```

---

## User Profile

### 1. Get User Profile
**NEW ENDPOINT**

**Endpoint:** `GET /user/profile`

**Protected:** 🔒 (Requires token)

**Authorization:** User role

**Rate Limit:** 20 requests per minute

**Response `200`:**
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "id": "USER_ID",
    "mobile": "9876543210",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "phone": "9876543210",
    "bio": "I love movies",
    "avatar": "https://cloudinary-avatar-url.jpg",
    "role": "user",
    "blocked": false,
    "lastLoginAt": "2025-01-20T10:30:00Z",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

**Error Codes:**
- `404` - User not found

---

### 2. Update User Profile
**Endpoint:** `PUT /user/profile`

**Protected:** 🔒 (Requires token)

**Authorization:** User role

**Request Body (form-data):**
```
{
  "name": "John Updated",
  "username": "johnupdated",
  "email": "newemail@example.com",
  "phone": "9876543210",
  "bio": "Updated bio",
  "avatar": <FILE>  // Optional: image file
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Profile updated",
  "data": {
    "id": "USER_ID",
    "mobile": "9876543210",
    "name": "John Updated",
    "username": "johnupdated",
    "email": "newemail@example.com",
    "phone": "9876543210",
    "bio": "Updated bio",
    "avatar": "https://cloudinary-avatar-url.jpg",
    "role": "user",
    "blocked": false
  }
}
```

**Validation Rules:**
- `name`: Max 100 characters
- `email`: Must be unique across users
- `avatar`: Image file only

**Error Codes:**
- `404` - User not found
- `409` - Email already in use

---

### 3. Get User's Purchased Movies
**Endpoint:** `GET /user/my-movies`

**Protected:** 🔒 (Requires token)

**Authorization:** User role

**Response `200`:**
```json
{
  "success": true,
  "message": "Movies fetched successfully",
  "data": [
    {
      "movieId": "MOVIE_ID",
      "title": "Movie Title",
      "description": "Movie description...",
      "price": 49.99,
      "coverImageUrl": "https://...",
      "partsCount": 1,
      "canWatch": true,
      "watchLink": "/watch/MOVIE_ID"
    }
  ]
}
```

---

### 4. Get User Transaction History
**Endpoint:** `GET /user/transactions?page=1&limit=20`

**Protected:** 🔒 (Requires token)

**Authorization:** User role

**Query Parameters:**
- `page` (optional) - Page number, default: 1
- `limit` (optional) - Results per page, default: 20, max: 50

**Response `200`:**
```json
{
  "success": true,
  "message": "Transactions fetched successfully",
  "data": [
    {
      "id": "PURCHASE_ID",
      "movieId": "MOVIE_ID",
      "movieTitle": "Movie Title",
      "amount": 49.99,
      "paymentStatus": "paid",
      "orderId": "order_RAZORPAY_ID",
      "paymentId": "pay_RAZORPAY_ID",
      "purchaseDate": "2025-01-10T12:00:00Z",
      "expiryDate": "2025-02-10T12:00:00Z",
      "createdAt": "2025-01-10T12:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 25,
    "totalPages": 2
  }
}
```

---

## Payments & Purchases

### 1. Create Payment Order (Rent Movie)
**NEW: Direct from movie detail page**

**Endpoint:** `POST /movies/:movieId/rent`

**Protected:** 🔒 (Requires token)

**Authorization:** User role

**Path Parameters:**
- `movieId` - Movie ID to rent

**Alternative Endpoint:** `POST /payment/create-order`

**Protected:** 🔒 (Requires token)

**Request Body:**
```json
{
  "movieId": "MOVIE_ID"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "Razorpay order created",
  "data": {
    "orderId": "order_RAZORPAY_ID",
    "amount": 4999,
    "currency": "INR",
    "keyId": "rzp_RAZORPAY_KEY",
    "movie": {
      "id": "MOVIE_ID",
      "title": "Movie Title",
      "price": 49.99,
      "validityDays": 30
    },
    "paymentOptions": {
      "upi": true,
      "qrCode": true,
      "gpayNumber": "xxxx@ybl",
      "gateway": "razorpay"
    }
  }
}
```

**Error Codes:**
- `404` - Movie not found
- `409` - Movie already purchased and access still active

---

### 2. Verify Payment
**Endpoint:** `POST /payment/verify`

**Protected:** 🔒 (Requires token)

**Authorization:** User role

**Rate Limit:** 10 requests per minute

**Request Body:**
```json
{
  "razorpay_order_id": "order_RAZORPAY_ID",
  "razorpay_payment_id": "pay_RAZORPAY_ID",
  "razorpay_signature": "SIGNATURE_HASH"
}
```

**Response `200`:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "purchaseId": "PURCHASE_ID",
    "movieId": "MOVIE_ID",
    "purchaseDate": "2025-01-10T12:00:00Z",
    "expiryDate": "2025-02-10T12:00:00Z",
    "amount": 49.99,
    "status": "paid",
    "watchLink": "/watch/MOVIE_ID"
  }
}
```

**Error Codes:**
- `400` - Invalid payment signature
- `404` - Order not found

---

### 3. Get Order Status
**Endpoint:** `GET /payment/order/:orderId`

**Protected:** 🔒 (Requires token)

**Rate Limit:** 10 requests per minute

**Path Parameters:**
- `orderId` - Razorpay Order ID

**Response `200`:**
```json
{
  "success": true,
  "message": "Order status fetched",
  "data": {
    "orderId": "order_RAZORPAY_ID",
    "status": "pending",
    "amount": 4999,
    "currency": "INR",
    "movieId": "MOVIE_ID",
    "movieTitle": "Movie Title",
    "createdAt": "2025-01-10T12:00:00Z"
  }
}
```

---

## Categories & Tags

### 1. List Categories
**Endpoint:** `GET /categories`

**Public Access:** ✅ (No token required)

**Response `200`:**
```json
{
  "success": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "id": "CATEGORY_ID",
      "name": "Action",
      "slug": "action",
      "description": "Action-packed movies"
    },
    {
      "id": "CATEGORY_ID_2",
      "name": "Comedy",
      "slug": "comedy",
      "description": "Funny and entertaining movies"
    }
  ]
}
```

---

### 2. List Tags
**Endpoint:** `GET /tags`

**Public Access:** ✅ (No token required)

**Response `200`:**
```json
{
  "success": true,
  "message": "Tags fetched successfully",
  "data": [
    {
      "id": "TAG_ID",
      "name": "Trending",
      "slug": "trending"
    },
    {
      "id": "TAG_ID_2",
      "name": "New Release",
      "slug": "new-release"
    }
  ]
}
```

---

## Error Handling

### Common Error Codes

| Code | Description | Solution |
|------|-------------|----------|
| 400 | Bad Request (invalid data) | Check request format and required fields |
| 401 | Unauthorized (invalid token) | Re-login to get new token |
| 403 | Forbidden (insufficient permissions) | User role not allowed for this action |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (email, purchase) |
| 429 | Too Many Requests | Rate limit exceeded, retry after delay |
| 500 | Server Error | Contact support |

### Error Response Format
```json
{
  "success": false,
  "message": "Specific error message"
}
```

---

## Rate Limiting

Rate limits are enforced on the following endpoints:

| Endpoint | Limit | Window |
|----------|-------|--------|
| Auth endpoints | 8/minute | 60 seconds |
| User profile | 20/minute | 60 seconds |
| Payment endpoints | 10/minute | 60 seconds |

**Response when limit exceeded:**
```
429 Too Many Requests
```

---

## Best Practices for Frontend

### 1. Token Management
```javascript
// Store token securely (localStorage or secure cookie)
localStorage.setItem('token', response.data.token);

// Use token in requests
headers: {
  'Authorization': `Bearer ${token}`
}
```

### 2. Error Handling
```javascript
try {
  const response = await fetch('/api/endpoint', options);
  if (!response.ok) {
    const error = await response.json();
    console.error(error.message);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

### 3. Pagination
```javascript
// Always paginate large datasets
const params = new URLSearchParams({
  page: 1,
  limit: 20
});
```

### 4. Caching
```javascript
// Movie lists are cached for 30 seconds
// Clear cache when user makes changes
```

### 5. Image URLs
Always use `secureUrl` if available, fallback to `url`:
```javascript
const imageUrl = movie.poster?.secureUrl || movie.poster?.url;
```

---

## Testing Credentials

### Demo User
```
Email/Mobile: demo@example.com / available
Use POST /auth/demo/user for instant access
```

### Development Mode
- In development, OTP and demo credentials are logged in responses
- Payment signatures are validated but use test Razorpay keys

---

## Support

For issues or questions:
1. Check the error message in the response
2. Verify token is valid and not expired
3. Check request format matches documentation
4. Review rate limits and retry logic

---

**Last Updated:** January 2025
**API Version:** 1.0
