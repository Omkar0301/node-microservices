# Node.js Microservices Boilerplate

A production-ready, scalable microservices boilerplate built with Node.js, Express.js, and Sequelize ORM for PostgreSQL. This boilerplate follows clean architecture principles, SOLID principles, and DRY practices with shared utilities to minimize code duplication.

## 🏗️ Architecture Overview

This boilerplate implements a microservices architecture with:

- **Independent services**: Each microservice has its own codebase and database
- **Clean architecture**: Separation of concerns with controllers, services, models, and validators
- **DRY Implementation**: Shared utilities and base classes to minimize code duplication
- **Standardized API responses**: Consistent response format across all services
- **Centralized error handling**: Global error handling middleware
- **Service Registry**: Dynamic service discovery and load balancing
- **Health check endpoints**: Service health monitoring

## 📁 Project Structure

```
microservices-boilerplate/
├── misc/
│   └── postman-collections/        # Postman collections for API testing
│       ├── full-collection.postman_collection.json
│       ├── user-service.postman_collection.json
│       └── product-service.postman_collection.json
│
├── shared/                          # Shared utilities and configurations
│   ├── config/
│   │   └── database.js             # Database configuration
│   │
│   ├── middleware/
│   │   ├── errorHandler.js         # Global error handling middleware
│   │   └── validation.js           # Request validation middleware
│   │
│   └── utils/
│       ├── asyncHandler.js         # Async error handling wrapper
│       ├── dataJoiner.js           # Utility for joining data
│       ├── httpClient.js           # HTTP client utilities
│       ├── logger.js               # Winston logger configuration
│       ├── responseFormatter.js    # Standardized API responses
│       └── serviceRegistry.js      # Service discovery and load balancing
├── services/                        # Individual microservices
│   └── user-service/               # User management microservice
│       ├── config/
│       │   └── database.js         # Database configuration
│       ├── controllers/
│       │   └── userController.js   # User controller
│       ├── migrations/
│       ├── models/
│       │   ├── User.js             # User model
│       │   └── index.js            # Sequelize models initialization
│       ├── routes/
│       │   ├── health.js           # Health check route
│       │   └── usersRoutes.js      # User routes
│       ├── services/
│       │   └── userService.js      # Business logic
│       ├── validators/
│       │   └── userValidator.js    # Request validation
│       ├── .env.development        # Environment configuration
│       └── index.js
│   └── product-service/            # Product management microservice
│       ├── config/
│       │   └── database.js          # Database configuration
│       ├── controllers/
│       │   └── productController.js # Product controller
│       ├── migrations/
│       ├── migrations/              # Database migrations
│       ├── models/
│       │   ├── Product.js           # Product model
│       │   └── index.js             # Sequelize models initialization
│       ├── routes/
│       │   ├── health.js            # Health check route
│       │   └── productsRoutes.js    # Product routes
│       ├── services/
│       │   └── productService.js    # Business logic
│       ├── validators/
│       │   └── productValidator.js  # Request validation
│       ├── .env.development         # Environment configuration
│       └── index.js
├── api-gateway.js                  # API Gateway with env configuration
├── .env.development                # Gateway environment configuration
├── .eslintrc.json
├── .prettierrc
├── .gitignore
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Environment Configuration

Each service uses environment variables for configuration. Create `.env.development` files for each service:

**Root directory (API Gateway):**

```bash
# .env.development
GATEWAY_PORT=3000
USER_SERVICE_URL=http://localhost:3001
PRODUCT_SERVICE_URL=http://localhost:3002
```

**User Service (`services/user-service/.env.development`):**

```bash
PORT=3001
DB_USER=postgres
DB_PASSWORD=admin
DB_NAME=user_service_dev
DB_HOST=localhost
DB_PORT=5432
```

**Product Service (`services/product-service/.env.development`):**

```bash
PORT=3002
DB_USER=postgres
DB_PASSWORD=admin
DB_NAME=product_service_dev
DB_HOST=localhost
DB_PORT=5432
```

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd microservices-boilerplate
   ```

2. **Install dependencies**:

   ```bash
   npm run install:services
   ```

3. **Set up databases**:

   ```bash
   # Create databases for each service
   cd services/user-service && npm run db:create
   cd ../product-service && npm run db:create
   ```

4. **Run migrations**:

   ```bash
   # Run migrations for all services
   npm run migrate:user-service
   npm run migrate:product-service
   ```

5. **Start all services**:

   ```bash
   npm run dev
   ```

6. **Start the services**
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
