// server.js - Complete Express server for Week 2 assignment

// Import required modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// TASK 4: CUSTOM ERROR CLASSES
// ========================================
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

// ========================================
// SAMPLE IN-MEMORY PRODUCTS DATABASE
// ========================================
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  },
  {
    id: '4',
    name: 'Desk Chair',
    description: 'Ergonomic office chair with lumbar support',
    price: 250,
    category: 'furniture',
    inStock: true
  },
  {
    id: '5',
    name: 'Headphones',
    description: 'Noise-cancelling wireless headphones',
    price: 150,
    category: 'electronics',
    inStock: true
  }
];

// ========================================
// TASK 3: MIDDLEWARE IMPLEMENTATION
// ========================================

// Middleware setup - Parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Custom logger middleware - logs request method, URL, and timestamp
const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  console.log(`[${timestamp}] ${method} ${url}`);
  next();
};

// Apply logger middleware to all routes
app.use(loggerMiddleware);

// Authentication middleware - checks for API key in request headers
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return next(new AuthenticationError('API key is required. Please provide x-api-key header.'));
  }
  
  // Validate API key (in production, check against database)
  const validApiKey = process.env.API_KEY || 'test-api-key-12345';
  if (apiKey !== validApiKey) {
    return next(new AuthenticationError('Invalid API key provided.'));
  }
  
  next();
};

// Validation middleware for product creation and update
const validateProduct = (req, res, next) => {
  const { name, price, category } = req.body;
  
  // Validate required fields
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return next(new ValidationError('Product name is required and must be a non-empty string'));
  }
  
  if (price === undefined || typeof price !== 'number' || price < 0) {
    return next(new ValidationError('Price is required and must be a non-negative number'));
  }
  
  if (!category || typeof category !== 'string' || category.trim() === '') {
    return next(new ValidationError('Category is required and must be a non-empty string'));
  }
  
  next();
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ========================================
// TASK 1: ROOT ROUTE (Hello World)
// ========================================
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Product API! Go to /api/products to see all products.',
    version: '1.0.0',
    endpoints: {
      'GET /': 'This welcome message',
      'GET /api/products': 'Get all products (supports filtering, pagination, search)',
      'GET /api/products/:id': 'Get a specific product by ID',
      'POST /api/products': 'Create a new product (requires x-api-key header)',
      'PUT /api/products/:id': 'Update a product (requires x-api-key header)',
      'DELETE /api/products/:id': 'Delete a product (requires x-api-key header)',
      'GET /api/products/stats/summary': 'Get product statistics by category'
    }
  });
});

// ========================================
// TASK 5: PRODUCT STATISTICS ENDPOINT
// ========================================
app.get('/api/products/stats/summary', asyncHandler(async (req, res) => {
  // Calculate statistics by category
  const stats = products.reduce((acc, product) => {
    const cat = product.category;
    if (!acc[cat]) {
      acc[cat] = {
        count: 0,
        totalValue: 0,
        inStock: 0,
        outOfStock: 0
      };
    }
    acc[cat].count++;
    acc[cat].totalValue += product.price;
    if (product.inStock) {
      acc[cat].inStock++;
    } else {
      acc[cat].outOfStock++;
    }
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    data: {
      totalProducts: products.length,
      totalCategories: Object.keys(stats).length,
      byCategory: stats
    }
  });
}));

// ========================================
// TASK 2 & 5: GET ALL PRODUCTS
// With filtering, pagination, and search
// ========================================
app.get('/api/products', asyncHandler(async (req, res) => {
  let filteredProducts = [...products];
  
  // TASK 5: Filter by category
  if (req.query.category) {
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === req.query.category.toLowerCase()
    );
  }
  
  // TASK 5: Filter by inStock status
  if (req.query.inStock !== undefined) {
    const inStockValue = req.query.inStock === 'true';
    filteredProducts = filteredProducts.filter(p => p.inStock === inStockValue);
  }
  
  // TASK 5: Search by name or description
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      p => p.name.toLowerCase().includes(searchTerm) ||
           p.description.toLowerCase().includes(searchTerm)
    );
  }
  
  // TASK 5: Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  res.status(200).json({
    success: true,
    count: paginatedProducts.length,
    total: filteredProducts.length,
    page,
    totalPages: Math.ceil(filteredProducts.length / limit),
    data: paginatedProducts
  });
}));

// ========================================
// TASK 2: GET SPECIFIC PRODUCT BY ID
// ========================================
app.get('/api/products/:id', asyncHandler(async (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  
  if (!product) {
    throw new NotFoundError(`Product with id ${req.params.id} not found`);
  }
  
  res.status(200).json({
    success: true,
    data: product
  });
}));

// ========================================
// TASK 2 & 3: CREATE NEW PRODUCT
// With authentication and validation
// ========================================
app.post('/api/products', authMiddleware, validateProduct, asyncHandler(async (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  
  // Create new product with UUID
  const newProduct = {
    id: uuidv4(),
    name: name.trim(),
    description: description ? description.trim() : '',
    price: parseFloat(price),
    category: category.trim().toLowerCase(),
    inStock: inStock !== undefined ? Boolean(inStock) : true
  };
  
  products.push(newProduct);
  
  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: newProduct
  });
}));

// ========================================
// TASK 2 & 3: UPDATE PRODUCT
// With authentication and validation
// ========================================
app.put('/api/products/:id', authMiddleware, validateProduct, asyncHandler(async (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    throw new NotFoundError(`Product with id ${req.params.id} not found`);
  }
  
  const { name, description, price, category, inStock } = req.body;
  
  // Update product
  products[productIndex] = {
    ...products[productIndex],
    name: name.trim(),
    description: description ? description.trim() : products[productIndex].description,
    price: parseFloat(price),
    category: category.trim().toLowerCase(),
    inStock: inStock !== undefined ? Boolean(inStock) : products[productIndex].inStock
  };
  
  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: products[productIndex]
  });
}));

// ========================================
// TASK 2 & 3: DELETE PRODUCT
// With authentication
// ========================================
app.delete('/api/products/:id', authMiddleware, asyncHandler(async (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    throw new NotFoundError(`Product with id ${req.params.id} not found`);
  }
  
  const deletedProduct = products.splice(productIndex, 1)[0];
  
  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    data: deletedProduct
  });
}));

// ========================================
// TASK 4: ERROR HANDLING MIDDLEWARE
// ========================================

// 404 handler for undefined routes
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
});

// Global error handling middleware
app.use((err, req, res, next) => {
  // Log error details
  console.error(`[ERROR] ${err.name}: ${err.message}`);
  
  // Determine status code
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      name: err.name,
      message: message,
      // Include stack trace only in development
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// ========================================
// START THE SERVER
// ========================================
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 API Key required for POST, PUT, DELETE operations`);
  console.log(`📚 Visit http://localhost:${PORT}/ for API documentation`);
});

// Export the app for testing purposes
module.exports = app;