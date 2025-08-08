# Node.js Microservices Boilerplate

A production-ready, scalable microservices boilerplate built with Node.js, Express.js, and Sequelize ORM. This boilerplate follows clean architecture principles, SOLID principles, and DRY practices with shared utilities to minimize code duplication.

## 🏗️ Architecture Overview

This boilerplate implements a microservices architecture with:

- **Independent services**: Each microservice has its own codebase and can have its own database
- **Clean architecture**: Clear separation of concerns with controllers, services, models, and validators
- **DRY Implementation**: Shared utilities and middleware to minimize code duplication
- **JWT-based Authentication**: Secure authentication with access and refresh tokens
- **Standardized API responses**: Consistent response format across all services
- **Centralized error handling**: Global error handling middleware
- **API Gateway**: Single entry point for all microservices
- **Health check endpoints**: Service health monitoring
- **Cookie and Token-based Auth**: Support for both cookie-based and token-based authentication

## 📁 Project Structure

````
microservices-boilerplate/
├── misc/
│   └── postman-collections/        # Postman collections for API testing
│       ├── full-collection.postman_collection.json
│       ├── auth-service.postman_collection.json
│       ├── user-service.postman_collection.json
│       └── product-service.postman_collection.json
│
├── services/                       # Individual microservices
│   ├── auth-service/              # Authentication service
│   ├── user-service/              # User management service
│   └── product-service/           # Product management service
│
├── shared/                         # Shared utilities and configurations
│   ├── config/                    # Configuration files
│   │   └── database.js            # Database configuration
│   │
│   ├── middleware/                # Express middleware
│   │   ├── errorHandler.js        # Global error handling
│   │   └── validation.js          # Request validation
│   │
│   └── utils/                     # Utility functions
│       ├── asyncHandler.js        # Async/await error handler
│       ├── logger.js              # Winston logger setup
│       └── responseFormatter.js   # Standard API responses
│
├── api-gateway.js                 # API Gateway configuration
├── run-services.js                # Script to run all services
├── install-services.js            # Script to install service dependencies
├── package.json                   # Root package.json
└── .env.development               # Environment variables
## 🚀 Services

### Auth Service
- **Purpose**: Handles user authentication and authorization
- **Port**: 3001
- **Endpoints**:
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - User login
  - `POST /api/auth/refresh-token` - Refresh access token
  - `POST /api/auth/logout` - Logout user
  - `GET /api/auth/health` - Health check

### User Service
- **Purpose**: Manages user data and profiles
- **Port**: 3002
- **Endpoints**:
  - `GET /api/users` - Get all users (with pagination)
  - `GET /api/users/:id` - Get user by ID
  - `POST /api/users` - Create a new user
  - `PUT /api/users/:id` - Update user
  - `DELETE /api/users/:id` - Delete user
  - `GET /api/users/health` - Health check

### Product Service
- **Purpose**: Manages product catalog
- **Port**: 3003
- **Endpoints**:
  - `GET /api/products` - Get all products (with pagination)
  - `GET /api/products/:id` - Get product by ID
  - `POST /api/products` - Create a new product
  - `PUT /api/products/:id` - Update product
  - `DELETE /api/products/:id` - Delete product
  - `GET /api/products/health` - Health check

## 🔌 API Gateway

- **Port**: 3000
- **Features**:
  - Routes requests to appropriate microservices
  - Handles CORS
  - Request/Response logging
  - Service health monitoring

## 🔒 Authentication Flow

1. **Register**: `POST /api/auth/register`
   - Creates a new user account
   - Returns access and refresh tokens

2. **Login**: `POST /api/auth/login`
   - Authenticates user credentials
   - Returns access and refresh tokens

3. **Access Protected Routes**:
   - Include `Authorization: Bearer <access_token>` in request headers

4. **Refresh Token**: `POST /api/auth/refresh-token`
   - Get new access token using refresh token

5. **Logout**: `POST /api/auth/logout`
   - Invalidates the refresh token
├── api-gateway.js                  # API Gateway with env configuration
├── .env.development                # Gateway environment configuration
├── .eslintrc.json
├── .prettierrc

## 📚 API Documentation

Detailed API documentation is available in the Postman collections located in the `misc/postman-collections/` directory:

- `auth-service.postman_collection.json` - Authentication API endpoints
- `user-service.postman_collection.json` - User management API endpoints
- `product-service.postman_collection.json` - Product management API endpoints
- `full-collection.postman_collection.json` - Complete API collection

### Importing to Postman

1. Open Postman
2. Click "Import" in the top-left corner
3. Select the desired collection file from `misc/postman-collections/`
4. Set up the following environment variables in Postman:
   - `gateway_url`: `http://localhost:3000`
   - `access_token`: (Will be set after login)
   - `refreshToken`: (Will be set after login)

### Example Requests

#### Register a New User
```http
POST {{gateway_url}}/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
````

#### Login

```http
POST {{gateway_url}}/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Get User Profile

```http
GET {{gateway_url}}/api/users/me
Authorization: Bearer {{access_token}}
```

#### Create Product

```http
POST {{gateway_url}}/api/products
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "stock": 100
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm (v8+)
- PostgreSQL (for each service)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/microservices-boilerplate.git
   cd microservices-boilerplate
   ```

2. Install dependencies:

   ```bash
   npm run install:all
   ```

   This will install root dependencies and then install dependencies for each service.

3. Set up environment variables:
   - Configure database connections in each service's `.env.development` file
   - Update API Gateway settings in the root `.env.development`

4. Start the services:

   ```bash
   # Development mode (with hot-reload)
   npm run dev
   ```

5. **Start the services**
   ```bash
   # From root directory
   npm run dev
   # Or start individual services
   npm run dev:user-service
   npm run dev:product-service
   ```

## 🛠️ Available Scripts

### Root Level Scripts

- `npm run dev` - Start all services in development mode using concurrently
- `npm run start` - Start all services in production mode
- `npm run services:dev` - Start only the microservices in development mode
- `npm run services:start` - Start only the microservices in production mode
- `npm run lint` - Lint all services
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format all code with Prettier
- `npm run install:all` - Install root and all service dependencies
- `npm run install:services` - Install dependencies for all services

### Service Level Scripts

Each service (user-service, product-service) supports these scripts:

- `npm run dev` - Start service with nodemon for development
- `npm start` - Start service in production mode
- `npm run lint` - Lint the service code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo the most recent migration
- `npm run seed` - Run database seeders
- `npm run seed:undo` - Undo all seeders
- `npm run db:create` - Create the database
- `npm run db:drop` - Drop the database

## 📊 API Endpoints

### User Service

- **Base URL**: `http://localhost:3001`
- **Health Check**: `GET /api/users/health`
- **Users**:
  - `POST /api/users` - Create a new user
  - `GET /api/users` - Get all users (with pagination)
  - `GET /api/users/:id` - Get user by ID
  - `PUT /api/users/:id` - Update user
  - `DELETE /api/users/:id` - Delete user
  - `POST /api/users/batch` - Get multiple users by IDs

### Product Service

- **Base URL**: `http://localhost:3002`
- **Health Check**: `GET /api/products/health`
- **Products**:
  - `POST /api/products` - Create a new product
  - `GET /api/products` - Get all products (with pagination)
  - `GET /api/products/:id` - Get product by ID
  - `PUT /api/products/:id` - Update product
  - `DELETE /api/products/:id` - Delete product
  - `POST /api/products/batch` - Get multiple products by IDs
  - `POST /api/products/by-users` - Get products by user IDs

### API Gateway

- **Port**: 3000 (configurable via `GATEWAY_PORT`)
- **Base URL**: `http://localhost:3000`
- **Features**:
  - Request routing to appropriate services
  - Load balancing between service instances
  - Service discovery
  - Request/Response logging

## 🎯 API Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "statusCode": 200
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ],
  "statusCode": 400
}
```

## 🔧 Development Guidelines

### Adding a New Microservice

1. **Create the service directory structure**:

   ```
   services/new-service/
   ├── controllers/
   ├── services/
   ├── models/
   ├── routes/
   ├── validators/
   ├── migrations/
   ├── seeders/
   ├── config/
   ├── .env.development    # Environment configuration
   └── index.js
   ```

2. **Copy package.json from existing service** and update name
3. **Create .env.development** with appropriate port and database settings
4. **Update API Gateway** to include new service URL in environment variables
5. **Follow the same patterns** as existing services for consistency

### Database Migrations

Create new migrations using Sequelize CLI:

```bash
cd services/your-service
npx sequelize-cli migration:generate --name migration-name
```

### Request Validation

Use Joi schemas in the `validators/` directory:

```javascript
const Joi = require('joi');

const createSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});
```

### Error Handling

All errors are automatically handled by the global error handler. Custom errors can be thrown and will be formatted consistently.

## 📈 Monitoring & Logging

- **Winston** for structured logging
- **Health check endpoints** for service monitoring
- **Request logging** for debugging

## 🔒 Security Features

- **Helmet** for security headers
- **CORS** configuration
- **Input validation** with Joi
- **SQL injection prevention** with Sequelize ORM

## 🚀 Production Deployment

1. **Environment variables** - Set production environment variables
2. **Database** - Use production PostgreSQL instance
3. **Process manager** - Use PM2 for process management
4. **Reverse proxy** - Use Nginx or similar for load balancing
5. **SSL/TLS** - Enable HTTPS
