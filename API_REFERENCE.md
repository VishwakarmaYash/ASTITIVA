# Vault API Reference

## Base URL
```
http://localhost:3001/api
```

## Authentication
All endpoints except `/auth/register` and `/auth/login` require:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Authentication Endpoints

### Register New User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201):
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "token": "eyJhbGc..."
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response (200):
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "token": "eyJhbGc..."
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer YOUR_TOKEN

Response (200):
{
  "id": "uuid",
  "email": "user@example.com"
}
```

---

## Products Endpoints

### Get All Products
```http
GET /products

Response (200):
[
  {
    "id": "kinetic-shell",
    "name": "KINETIC SHELL",
    "price": 540,
    "colorCode": "WHITE / 01",
    "image": "https://...",
    "category": "Jackets",
    "description": "...",
    "features": ["Feature 1", "Feature 2"],
    "specs": ["Spec 1", "Spec 2"],
    "sizes": ["XS", "S", "M", "L", "XL"],
    "inventory": 100
  },
  ...
]
```

### Get Single Product
```http
GET /products/:id

Response (200):
{
  "id": "kinetic-shell",
  "name": "KINETIC SHELL",
  ...
}
```

---

## Cart Endpoints

### Get Cart
```http
GET /cart
Authorization: Bearer YOUR_TOKEN

Response (200):
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "product_id": "kinetic-shell",
    "size": "M",
    "quantity": 1,
    "products": {
      "id": "kinetic-shell",
      "name": "KINETIC SHELL",
      "price": 540,
      ...
    }
  }
]
```

### Add to Cart
```http
POST /cart/add
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "kinetic-shell",
  "size": "M",
  "quantity": 1
}

Response (201):
{
  "id": "uuid",
  "product_id": "kinetic-shell",
  "size": "M",
  "quantity": 1,
  "products": { ... }
}
```

### Update Cart Item Quantity
```http
PUT /cart/:itemId
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "quantity": 2
}

Response (200):
{
  "id": "uuid",
  "quantity": 2,
  ...
}
```

### Remove from Cart
```http
DELETE /cart/:itemId
Authorization: Bearer YOUR_TOKEN

Response (200):
{
  "deleted": true
}
```

### Clear Entire Cart
```http
DELETE /cart
Authorization: Bearer YOUR_TOKEN

Response (200):
{
  "cleared": true
}
```

---

## Orders Endpoints

### Create Checkout Session
```http
POST /orders/checkout
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "cart": [
    {
      "id": "kinetic-shell-M",
      "product_id": "kinetic-shell",
      "size": "M",
      "quantity": 1,
      "products": {
        "id": "kinetic-shell",
        "name": "KINETIC SHELL",
        "price": 540,
        "image": "https://..."
      }
    }
  ],
  "shippingAddress": "123 Main St, City, State 12345"
}

Response (200):
{
  "sessionId": "cs_test_...",
  "orderId": "ORD-20240101000001"
}
```

### Get User's Orders
```http
GET /orders
Authorization: Bearer YOUR_TOKEN

Response (200):
[
  {
    "id": "ORD-20240101000001",
    "user_id": "uuid",
    "status": "pending",
    "subtotal": 540,
    "tax": 54,
    "shipping": 10,
    "total": 604,
    "created_at": "2024-01-01T00:00:00Z",
    "order_items": [
      {
        "id": "uuid",
        "product_name": "KINETIC SHELL",
        "size": "M",
        "quantity": 1,
        "price": 540
      }
    ]
  }
]
```

### Get Single Order
```http
GET /orders/:orderId
Authorization: Bearer YOUR_TOKEN

Response (200):
{
  "id": "ORD-20240101000001",
  "user_id": "uuid",
  "status": "pending",
  ...
}
```

---

## Wishlist Endpoints

### Get Wishlist
```http
GET /wishlist
Authorization: Bearer YOUR_TOKEN

Response (200):
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "product_id": "kinetic-shell",
    "created_at": "2024-01-01T00:00:00Z",
    "products": {
      "id": "kinetic-shell",
      "name": "KINETIC SHELL",
      "price": 540,
      ...
    }
  }
]
```

### Add to Wishlist
```http
POST /wishlist/add
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "productId": "kinetic-shell"
}

Response (201):
{
  "id": "uuid",
  "product_id": "kinetic-shell",
  ...
}
```

### Remove from Wishlist
```http
DELETE /wishlist/:productId
Authorization: Bearer YOUR_TOKEN

Response (200):
{
  "deleted": true
}
```

---

## Error Responses

All error responses follow this format:

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Error message describing what went wrong"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad request (missing/invalid data)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (not allowed to access resource)
- `404` - Not found
- `500` - Server error

---

## Example: Complete User Journey

```javascript
// 1. Register
const registerRes = await fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const { token } = await registerRes.json();
localStorage.setItem('token', token);

// 2. Get products
const productsRes = await fetch('http://localhost:3001/api/products');
const products = await productsRes.json();

// 3. Add to cart
const cartRes = await fetch('http://localhost:3001/api/cart/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    productId: products[0].id,
    size: 'M',
    quantity: 1
  })
});

// 4. Checkout
const checkoutRes = await fetch('http://localhost:3001/api/orders/checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    cart: [await cartRes.json()],
    shippingAddress: '123 Main St'
  })
});
const { sessionId } = await checkoutRes.json();

// 5. Redirect to Stripe checkout
window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
```
