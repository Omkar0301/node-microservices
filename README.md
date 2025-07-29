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
│       └── index.js
├── .eslintrc.json
├── .prettierrc
├── .gitignore
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd microservices-boilerplate
   ```

2. **Install dependencies**

   ```bash
   npm run install:all
   ```

3. **Set up databases**

   ```bash
   # Create databases for each service
   createdb user_service_db
   createdb product_service_db
   ```

4. **Configure environment variables**

   ```bash
   # Each service has its own .env.development file
   # Update database credentials as needed
   ```

5. **Run migrations and seeders**

   ```bash
   # User service
   cd services/user-service
   npm run migrate
   npm run seed

   # Product service
   cd ../product-service
   npm run migrate
   npm run seed
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
- `npm run install:all` - Install dependencies for all services

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

### User Service (Port 3001)

- `GET /health` - Health check endpoint
- `POST /api/users` - Create a new user
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Product Service (Port 3002)

- `GET /health` - Health check endpoint
- `POST /api/products` - Create a new product
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

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
   └── index.js
   ```

2. **Copy the package.json template** and update service-specific details

3. **Set up Sequelize configuration**:
   - Create `.sequelizerc`
   - Create `config/database.js`

4. **Implement the service** following the existing patterns

5. **Add environment configuration** in `.env.development`

6. **Update root package.json** with new service scripts

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
