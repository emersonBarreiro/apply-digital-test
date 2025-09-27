# Contentful Products API

A NestJS-based REST API that synchronizes product data from Contentful CMS with comprehensive reporting and analytics capabilities.

## Features

- **Automated Contentful Sync**: Hourly synchronization of product data from Contentful CMS
- **Public API**: CRUD operations with pagination and filtering for product management
- **Private Analytics**: JWT-protected reporting endpoints with data quality metrics
- **Comprehensive Documentation**: Full Swagger/OpenAPI documentation at `/api/docs`
- **Docker Ready**: Complete containerization with PostgreSQL database
- **High Test Coverage**: 30%+ test coverage with unit and e2e tests
- **CI/CD Pipeline**: Automated testing, linting, and security checks

## Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

## Quick Start

### Prerequisites

- Node.js 18+ (LTS version)
- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd apply-digital-test
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration if needed
   ```

3. **Start with Docker (Recommended)**
   ```bash
   # Start the application and database
   docker-compose up -d

   # Check logs
   docker-compose logs -f app
   ```

4. **Local Development Setup**
   ```bash
   # Install dependencies
   npm install

   # Start PostgreSQL (ensure Docker is running)
   docker-compose up -d db

   # Run database migrations (automatic on first startup)
   npm run start:dev
   ```

### First Time Setup

1. **Access the application**
   - API: http://localhost:3000
   - Documentation: http://localhost:3000/api/docs
   - Health Check: http://localhost:3000/health

2. **Initial Data Sync**
   ```bash
   # Trigger manual sync to populate database
   curl -X POST http://localhost:3000/sync/manual \
        -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

3. **Get JWT Token**
   ```bash
   # Generate demo token
   curl -X POST http://localhost:3000/auth/demo-token

   # Or login with credentials
   curl -X POST http://localhost:3000/auth/login \
        -H "Content-Type: application/json" \
        -d '{"username": "admin", "password": "admin123"}'
   ```

## API Endpoints

### Public Endpoints

- `GET /products` - List products with pagination and filters
- `GET /products/:id` - Get single product
- `DELETE /products/:id` - Soft delete product
- `GET /health` - Health check

### Authentication

- `POST /auth/login` - Login (username: admin, password: admin123)
- `POST /auth/demo-token` - Generate demo JWT token

### Private Endpoints (JWT Required)

- `GET /reports/deletion-summary` - Deletion statistics
- `GET /reports/pricing-analysis` - Products with/without pricing
- `GET /reports/data-quality` - Data integrity report
- `GET /reports/all` - Comprehensive analytics
- `POST /sync/manual` - Manual Contentful sync

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/contentful_api

# Contentful API (Pre-configured)
CONTENTFUL_SPACE_ID=9xs1613l9f7v
CONTENTFUL_ACCESS_TOKEN=I-ThsT55eE_B3sCUWEQyDT4VqVO3x__20ufuie9usns
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_CONTENT_TYPE=product

# Security
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# Application
NODE_ENV=development
PORT=3000
SYNC_INTERVAL_HOURS=1
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage (30%+ required)
npm run test:cov

# Watch mode
npm run test:watch
```

## Development Commands

```bash
# Development server with hot reload
npm run start:dev

# Production build
npm run build

# Production server
npm run start:prod

# Linting
npm run lint

# Format code
npm run format
```

## Docker Commands

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild containers
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.yml up -d
```

## API Usage Examples

### Get Products with Filters
```bash
curl "http://localhost:3000/products?page=1&limit=5&name=iPhone&minPrice=100"
```

### Authentication Flow
```bash
# Get token
TOKEN=$(curl -s -X POST http://localhost:3000/auth/demo-token | jq -r '.access_token')

# Use token for private endpoints
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/reports/all
```

### Manual Sync
```bash
curl -X POST http://localhost:3000/sync/manual \
     -H "Authorization: Bearer $TOKEN"
```

## Architecture

```
src/
├── modules/
│   ├── public/           # Public API endpoints
│   │   ├── products/     # Product CRUD operations
│   │   └── contentful/   # Contentful integration
│   ├── private/          # JWT-protected endpoints
│   │   └── reports/      # Analytics and reporting
│   ├── auth/             # JWT authentication
│   └── sync/             # Scheduled synchronization
├── common/
│   ├── entities/         # TypeORM entities
│   ├── guards/           # Auth guards
│   └── strategies/       # Passport strategies
└── config/               # Configuration files
```

## Reports Available

1. **Deletion Summary**: Percentage of deleted vs active products
2. **Pricing Analysis**: Products with/without pricing data by date range
3. **Data Quality Report**: Missing fields, invalid data, integrity scores

## Monitoring

- **Health Check**: `GET /health`
- **Logs**: Available via Docker logs or application stdout
- **Metrics**: Database queries, sync status, API response times

## Security Features

- JWT-based authentication for private endpoints
- Input validation with class-validator
- SQL injection prevention with TypeORM
- CORS configuration
- Security audit in CI/CD pipeline

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   docker-compose down
   docker-compose up -d db
   # Wait for PostgreSQL to start, then restart app
   ```

2. **Contentful Sync Fails**
   - Check environment variables are set correctly
   - Verify Contentful API credentials
   - Check network connectivity

3. **JWT Token Issues**
   - Ensure JWT_SECRET is set
   - Check token expiration
   - Verify Authorization header format: `Bearer <token>`

### Development Tips

- Use `npm run start:dev` for hot reload during development
- Check logs with `docker-compose logs -f app`
- Use Swagger docs at `/api/docs` for API testing
- Run tests before committing changes

## License

This project is licensed under the MIT License.
