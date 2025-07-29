# Node.js Microservices Boilerplate

A production-ready, scalable microservices boilerplate built with Node.js, Express.js, and Sequelize ORM for PostgreSQL. This boilerplate follows clean architecture principles, SOLID principles, and DRY practices.

## 🏗️ Architecture Overview

This boilerplate implements a microservices architecture with:

- **Independent services**: Each microservice has its own codebase and database
- **Clean architecture**: Separation of concerns with controllers, services, models, and validators
- **Standardized API responses**: Consistent response format across all services
- **Centralized error handling**: Global error handling middleware
- **Health check endpoints**: Service health monitoring

## 📁 Project Structure

```
microservices-boilerplate/
├── shared/                          # Shared utilities and configurations
│   ├── utils/
│   │   ├── logger.js               # Winston logger configuration
│   │   ├── responseFormatter.js    # Standardized API responses
│   │   └── asyncHandler.js         # Async error handling wrapper
│   ├── middleware/
│   │   ├── errorHandler.js         # Global error handling middleware
│   │   └── validation.js           # Request validation middleware
│   └── config/
│       └── database.js             # Shared database configuration
├── services/                        # Individual microservices
│   ├── user-service/               # User management microservice
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   ├── config/
│   │   ├── .env.development        # Environment configuration
│   │   └── index.js
│   └── product-service/            # Product management microservice
│       ├── controllers/
│       ├── services/
│       ├── models/
│       ├── routes/
│       ├── validators/
│       ├── migrations/
│       ├── seeders/
│       ├── config/
│       ├── .env.development        # Environment configuration
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

- `npm run dev` - Start all services in development mode
- `npm run start` - Start all services in production mode
- `npm run lint` - Lint all services
- `npm run format` - Format all services with Prettier
- `npm run install:services` - Install dependencies for all services

### Service Level Scripts

- `npm run dev` - Start service in development mode with nodemon
- `npm run start` - Start service in production mode
- `npm run lint` - Lint the service
- `npm run format` - Format the service with Prettier
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration
- `npm run seed` - Run database seeders
- `npm run seed:undo` - Undo all seeders

## 📊 API Endpoints

### User Service

- **Base URL**: Configurable via `USER_SERVICE_URL` environment variable
- **Default**: `http://localhost:3001`

- `GET /health` - Health check endpoint
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Product Service

- **Base URL**: Configurable via `PRODUCT_SERVICE_URL` environment variable
- **Default**: `http://localhost:3002`

- `GET /health` - Health check endpoint
- `POST /api/products` - Create a new product
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### API Gateway

- **Port**: Configurable via `GATEWAY_PORT` environment variable
- **Default**: `http://localhost:3000`

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

## 📞 Support

For questions or issues, please create an issue in the repository or refer to the documentation.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
