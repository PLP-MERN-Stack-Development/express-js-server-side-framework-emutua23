# Express.js RESTful API - Products Management System

A fully functional RESTful API built with Express.js that implements complete CRUD operations, custom middleware, comprehensive error handling, and advanced features including filtering, pagination, and search capabilities.

---

## 🎯 Assignment Objectives Completed

✅ **Task 1**: Express.js Setup with Hello World route  
✅ **Task 2**: RESTful API Routes (GET, POST, PUT, DELETE)  
✅ **Task 3**: Middleware Implementation (Logger, Authentication, Validation)  
✅ **Task 4**: Error Handling with Custom Error Classes  
✅ **Task 5**: Advanced Features (Filtering, Pagination, Search, Statistics)  

---

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (for cloning and version control)
- **Postman** or **Insomnia** (for API testing) - Optional but recommended

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/PLP-MERN-Stack-Development/express-js-server-side-framework-emutua23.git
cd express-js-server-side-framework-emutua23
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `body-parser` - Parse incoming request bodies
- `uuid` - Generate unique IDs
- `dotenv` - Load environment variables
- `nodemon` - Auto-restart server during development

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
PORT=3000
NODE_ENV=development
API_KEY=test-api-key-12345
```

### 4. Start the Server

**Production mode:**
```bash
npm start
```

**Development mode (with auto-restart):**
```bash
npm run dev
```

You should see:
```
✅ Server is running on http://localhost:3000
📝 Environment: development
🔑 API Key required for POST, PUT, DELETE operations
📚 Visit http://localhost:3000/ for API documentation
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication

Protected routes require an API key in the request headers:

**Header:**
```
x-api-key: test-api-key-12345
```

**Protected Routes:**
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

---

## 🔌 API Endpoints

### 1️⃣ Root Endpoint - Welcome Message

**Endpoint:** `GET /`  
**Authentication:** Not required

**Description:** Returns welcome message and list of available endpoints.

**Request:**
```bash
curl http://localhost:3000/
```

**Response:**
```json
{
  "message": "Welcome to the Product API! Go to /api/products to see all products.",
  "version": "1.0.0",
  "endpoints": {
    "GET /": "This welcome message",
    "GET /api/products": "Get all products (supports filtering, pagination, search)",
    "GET /api/products/:id": "Get a specific product by ID",
    "POST /api/products": "Create a new product (requires x-api-key header)",
    "PUT /api/products/:id": "Update a product (requires x-api-key header)",
    "DELETE /api/products/:id": "Delete a product (requires x-api-key header)",
    "GET /api/products/stats/summary": "Get product statistics by category"
  }
}
```

---

### 2️⃣ Get All Products

**Endpoint:** `GET /api/products`  
**Authentication:** Not required

**Query Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `category` | string | Filter by category | `electronics` |
| `inStock` | boolean | Filter by stock status | `true` or `false` |
| `search` | string | Search in name/description | `laptop` |
| `page` | number | Page number (default: 1) | `1` |
| `limit` | number | Items per page (default: 10) | `5` |

**Examples:**

**Get all products:**
```bash
curl http://localhost:3000/api/products
```

**Filter by category:**
```bash
curl "http://localhost:3000/api/products?category=electronics"
```

**Filter by stock status:**
```bash
curl "http://localhost:3000/api/products?inStock=true"
```

**Search products:**
```bash
curl "http://localhost:3000/api/products?search=laptop"
```

**With pagination:**
```bash
curl "http://localhost:3000/api/products?page=1&limit=3"
```

**Combined filters:**
```bash
curl "http://localhost:3000/api/products?category=electronics&inStock=true&page=1&limit=5"
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "total": 2,
  "page": 1,
  "totalPages": 1,
  "data": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    },
    {
      "id": "2",
      "name": "Smartphone",
      "description": "Latest model with 128GB storage",
      "price": 800,
      "category": "electronics",
      "inStock": true
    }
  ]
}
```

---

### 3️⃣ Get Product by ID

**Endpoint:** `GET /api/products/:id`  
**Authentication:** Not required

**Description:** Retrieve a specific product by its ID.

**Request:**
```bash
curl http://localhost:3000/api/products/1
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "name": "Laptop",
    "description": "High-performance laptop with 16GB RAM",
    "price": 1200,
    "category": "electronics",
    "inStock": true
  }
}
```

**Response (Not Found - 404):**
```json
{
  "success": false,
  "error": {
    "name": "NotFoundError",
    "message": "Product with id 999 not found"
  }
}
```

---

### 4️⃣ Create New Product

**Endpoint:** `POST /api/products`  
**Authentication:** 🔒 Required

**Headers:**
```
Content-Type: application/json
x-api-key: test-api-key-12345
```

**Request Body:**
```json
{
  "name": "Wireless Mouse",
  "description": "Ergonomic wireless mouse with 3 buttons",
  "price": 29.99,
  "category": "electronics",
  "inStock": true
}
```

**Required Fields:**
- `name` (string) - Product name
- `price` (number) - Product price (must be non-negative)
- `category` (string) - Product category

**Optional Fields:**
- `description` (string) - Product description
- `inStock` (boolean) - Stock status (default: true)

**Request:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: test-api-key-12345" \
  -d "{\"name\":\"Wireless Mouse\",\"description\":\"Ergonomic wireless mouse\",\"price\":29.99,\"category\":\"electronics\",\"inStock\":true}"
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse",
    "price": 29.99,
    "category": "electronics",
    "inStock": true
  }
}
```

**Response (Validation Error - 400):**
```json
{
  "success": false,
  "error": {
    "name": "ValidationError",
    "message": "Product name is required and must be a non-empty string"
  }
}
```

**Response (Authentication Error - 401):**
```json
{
  "success": false,
  "error": {
    "name": "AuthenticationError",
    "message": "API key is required. Please provide x-api-key header."
  }
}
```

---

### 5️⃣ Update Product

**Endpoint:** `PUT /api/products/:id`  
**Authentication:** 🔒 Required

**Headers:**
```
Content-Type: application/json
x-api-key: test-api-key-12345
```

**Request Body:**
```json
{
  "name": "Gaming Laptop",
  "description": "High-performance gaming laptop with RTX 4080",
  "price": 1899.99,
  "category": "electronics",
  "inStock": true
}
```

**Request:**
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -H "x-api-key: test-api-key-12345" \
  -d "{\"name\":\"Gaming Laptop\",\"description\":\"High-performance gaming laptop\",\"price\":1899.99,\"category\":\"electronics\",\"inStock\":true}"
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "1",
    "name": "Gaming Laptop",
    "description": "High-performance gaming laptop with RTX 4080",
    "price": 1899.99,
    "category": "electronics",
    "inStock": true
  }
}
```

---

### 6️⃣ Delete Product

**Endpoint:** `DELETE /api/products/:id`  
**Authentication:** 🔒 Required

**Headers:**
```
x-api-key: test-api-key-12345
```

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/products/3 \
  -H "x-api-key: test-api-key-12345"
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "id": "3",
    "name": "Coffee Maker",
    "description": "Programmable coffee maker with timer",
    "price": 50,
    "category": "kitchen",
    "inStock": false
  }
}
```

---

### 7️⃣ Get Product Statistics

**Endpoint:** `GET /api/products/stats/summary`  
**Authentication:** Not required

**Description:** Get comprehensive statistics about products grouped by category.

**Request:**
```bash
curl http://localhost:3000/api/products/stats/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 5,
    "totalCategories": 3,
    "byCategory": {
      "electronics": {
        "count": 3,
        "totalValue": 2150,
        "inStock": 3,
        "outOfStock": 0
      },
      "kitchen": {
        "count": 1,
        "totalValue": 50,
        "inStock": 0,
        "outOfStock": 1
      },
      "furniture": {
        "count": 1,
        "totalValue": 250,
        "inStock": 1,
        "outOfStock": 0
      }
    }
  }
}
```

---

## ❌ Error Responses

### Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "error": {
    "name": "ErrorType",
    "message": "Error description"
  }
}
```

### Common Error Types

#### 400 - Validation Error
```json
{
  "success": false,
  "error": {
    "name": "ValidationError",
    "message": "Price is required and must be a non-negative number"
  }
}
```

#### 401 - Authentication Error
```json
{
  "success": false,
  "error": {
    "name": "AuthenticationError",
    "message": "Invalid API key provided."
  }
}
```

#### 404 - Not Found Error
```json
{
  "success": false,
  "error": {
    "name": "NotFoundError",
    "message": "Product with id 123 not found"
  }
}
```

#### 500 - Internal Server Error
```json
{
  "success": false,
  "error": {
    "name": "Error",
    "message": "Internal server error"
  }
}
```

---

## 🧪 Testing Guide

### Using cURL (Command Line)

**Windows Command Prompt:**
Use `^` for line continuation:
```bash
curl -X POST http://localhost:3000/api/products ^
  -H "Content-Type: application/json" ^
  -H "x-api-key: test-api-key-12345" ^
  -d "{\"name\":\"Test Product\",\"price\":99.99,\"category\":\"test\"}"
```

**PowerShell:**
Use backtick `` ` `` for line continuation:
```powershell
curl -X POST http://localhost:3000/api/products `
  -H "Content-Type: application/json" `
  -H "x-api-key: test-api-key-12345" `
  -d '{\"name\":\"Test Product\",\"price\":99.99,\"category\":\"test\"}'
```

### Using Postman

1. **Import Collection:**
   - Create a new collection called "Products API"
   - Add environment variable: `API_KEY` = `test-api-key-12345`

2. **Test GET Requests:**
   - No authentication needed
   - Just enter the URL and click Send

3. **Test POST/PUT/DELETE:**
   - Go to Headers tab
   - Add: `x-api-key` with value `{{API_KEY}}`
   - Go to Body tab → Select "raw" → Choose "JSON"
   - Enter your JSON data

---

## 🛡️ Middleware Details

### 1. Logger Middleware
Logs every incoming request with timestamp, method, and URL.

**Example Output:**
```
[2025-10-04T14:30:45.123Z] GET /api/products
[2025-10-04T14:30:50.456Z] POST /api/products
```

### 2. Authentication Middleware
Validates API key for protected routes (POST, PUT, DELETE).

**Checks:**
- Presence of `x-api-key` header
- Validity of API key against environment variable

### 3. Validation Middleware
Validates product data before creation or update.

**Validates:**
- `name` - Must be a non-empty string
- `price` - Must be a non-negative number
- `category` - Must be a non-empty string

### 4. Body Parser Middleware
Parses incoming JSON and URL-encoded data.

### 5. Error Handling Middleware
Catches all errors and formats them consistently.

---

## 📁 Project Structure

```
express-js-server-side-framework-emutua23/
│
├── node_modules/           # Dependencies (auto-generated)
│
├── .env                    # Environment variables (not in git)
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Locked dependency versions
├── README.md               # This file
├── server.js               # Main application file

```

---

## 🔧 Technical Implementation Details

### Custom Error Classes

Three custom error classes extend the base `Error` class:

```javascript
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}
```

### Async Error Handler

Wrapper function to catch async errors:

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

### Data Storage

Products are stored in-memory using a JavaScript array. Data persists only during server runtime and resets on restart.

**Production Note:** For production applications, integrate a database like MongoDB, PostgreSQL, or MySQL.

---

## 🧪 Complete Testing Checklist

### ✅ Task 1: Basic Setup

- [ ] Server starts on port 3000
- [ ] Root endpoint (`/`) returns welcome message
- [ ] Logger middleware logs all requests

**Test:**
```bash
curl http://localhost:3000/
```

### ✅ Task 2: CRUD Operations

- [ ] **GET** all products works
- [ ] **GET** specific product by ID works
- [ ] **POST** creates new product (with auth)
- [ ] **PUT** updates existing product (with auth)
- [ ] **DELETE** removes product (with auth)

**Tests:**
```bash
# GET all
curl http://localhost:3000/api/products

# GET by ID
curl http://localhost:3000/api/products/1

# POST (create)
curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -H "x-api-key: test-api-key-12345" -d "{\"name\":\"Monitor\",\"price\":299.99,\"category\":\"electronics\"}"

# PUT (update)
curl -X PUT http://localhost:3000/api/products/1 -H "Content-Type: application/json" -H "x-api-key: test-api-key-12345" -d "{\"name\":\"Updated Laptop\",\"price\":1299.99,\"category\":\"electronics\"}"

# DELETE
curl -X DELETE http://localhost:3000/api/products/4 -H "x-api-key: test-api-key-12345"
```

### ✅ Task 3: Middleware

- [ ] Logger logs timestamp, method, and URL
- [ ] Auth middleware blocks requests without API key
- [ ] Auth middleware blocks requests with invalid API key
- [ ] Validation middleware rejects invalid data

**Tests:**
```bash
# Test without API key (should fail)
curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"price\":99,\"category\":\"test\"}"

# Test with wrong API key (should fail)
curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -H "x-api-key: wrong-key" -d "{\"name\":\"Test\",\"price\":99,\"category\":\"test\"}"

# Test without required fields (should fail)
curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -H "x-api-key: test-api-key-12345" -d "{\"description\":\"Test\"}"
```

### ✅ Task 4: Error Handling

- [ ] 404 error for non-existent routes
- [ ] 404 error for non-existent products
- [ ] 400 error for validation failures
- [ ] 401 error for auth failures
- [ ] 500 error for server errors

**Tests:**
```bash
# Non-existent route
curl http://localhost:3000/api/invalid

# Non-existent product
curl http://localhost:3000/api/products/999

# Invalid data
curl -X POST http://localhost:3000/api/products -H "Content-Type: application/json" -H "x-api-key: test-api-key-12345" -d "{\"name\":\"\",\"price\":-10,\"category\":\"\"}"
```

### ✅ Task 5: Advanced Features

- [ ] Filter by category works
- [ ] Filter by stock status works
- [ ] Search functionality works
- [ ] Pagination works
- [ ] Statistics endpoint works

**Tests:**
```bash
# Filter by category
curl "http://localhost:3000/api/products?category=electronics"

# Filter by stock
curl "http://localhost:3000/api/products?inStock=true"

# Search
curl "http://localhost:3000/api/products?search=laptop"

# Pagination
curl "http://localhost:3000/api/products?page=1&limit=2"

# Combined
curl "http://localhost:3000/api/products?category=electronics&inStock=true&page=1&limit=5"

# Statistics
curl http://localhost:3000/api/products/stats/summary
```

---

## 🚀 Deployment Considerations

### Environment Variables

For production deployment:

```env
PORT=80
NODE_ENV=production
API_KEY=your-secure-random-api-key-here
```

### Security Enhancements

1. **Use environment-specific API keys**
2. **Implement rate limiting**
3. **Add CORS configuration**
4. **Use HTTPS in production**
5. **Implement JWT authentication** instead of simple API keys
6. **Add input sanitization**
7. **Implement request validation with libraries like Joi**

### Database Integration

Replace in-memory storage with a database:

```javascript
// Example with MongoDB
const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  inStock: Boolean
});

const Product = mongoose.model('Product', productSchema);
```

---

## 📖 Learning Resources

- [Express.js Official Documentation](https://expressjs.com/)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [JWT Authentication Guide](https://jwt.io/introduction)

---

## 🐛 Troubleshooting

### Server won't start

**Problem:** `Error: Cannot find module 'express'`

**Solution:**
```bash
npm install
```

### API key not working

**Problem:** `AuthenticationError: Invalid API key provided`

**Solution:**
- Check `.env` file exists
- Verify `API_KEY=test-api-key-12345` in `.env`
- Restart the server after changing `.env`

### Port already in use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or change port in .env
PORT=3001
```

### Changes not reflecting

**Problem:** Code changes don't appear

**Solution:**
- If using `npm start`: Stop and restart server manually
- Use `npm run dev` for auto-restart with nodemon

---

## 📝 Assignment Submission Checklist

Before submitting, ensure:

- [ ] All dependencies installed (`npm install` runs successfully)
- [ ] Server starts without errors (`npm start`)
- [ ] All 5 tasks completed
- [ ] `.env.example` file included
- [ ] `.env` file in `.gitignore`
- [ ] `README.md` with complete documentation
- [ ] All API endpoints tested and working
- [ ] Code properly commented
- [ ] No console errors or warnings
- [ ] Git repository pushed to GitHub

---

## 🎓 Tasks Completion Summary

### ✅ Task 1: Express.js Setup
- ✓ Node.js project initialized
- ✓ Express.js and dependencies installed
- ✓ Server listens on port 3000
- ✓ "Hello World" route at root endpoint

### ✅ Task 2: RESTful API Routes
- ✓ Product resource with all required fields
- ✓ GET /api/products - List all products
- ✓ GET /api/products/:id - Get specific product
- ✓ POST /api/products - Create new product
- ✓ PUT /api/products/:id - Update product
- ✓ DELETE /api/products/:id - Delete product

### ✅ Task 3: Middleware Implementation
- ✓ Custom logger middleware (logs method, URL, timestamp)
- ✓ JSON body parser middleware
- ✓ Authentication middleware (checks API key)
- ✓ Validation middleware (validates product data)

### ✅ Task 4: Error Handling
- ✓ Global error handling middleware
- ✓ Custom error classes (NotFoundError, ValidationError, AuthenticationError)
- ✓ Proper HTTP status codes
- ✓ Async error handling with try/catch wrapper

### ✅ Task 5: Advanced Features
- ✓ Query parameters for category filtering
- ✓ Pagination support (page, limit)
- ✓ Search endpoint (by name/description)
- ✓ Product statistics route (count by category)

---

## 👨‍💻 Author

**Emmanuel Mutua**

- GitHub: [@emutua23](https://github.com/emutua23)
- Assignment: Express.js Server-Side Framework
- Course: PLP MERN Stack Development

---

## 📄 License

ISC License

---

## 🙏 Acknowledgments

- PLP Academy for the course structure
- Express.js team for the excellent framework
- Node.js community for comprehensive documentation

---

## 📞 Support

If you encounter any issues:

1. Check the Troubleshooting section
2. Review the error messages carefully
3. Ensure all dependencies are installed
4. Verify environment variables are set correctly
5. Contact your instructor for assignment-specific questions

---

**Last Updated:** October 4, 2025  
**Version:** 1.0.0
