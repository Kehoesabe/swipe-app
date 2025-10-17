# Swipe Type Backend API

Backend API for the Swipe Type Assessment with Stripe payments and admin dashboard functionality.

## Features

- **Payment Processing**: Stripe integration for one-time payments
- **Admin Dashboard**: Complete admin interface for managing purchases and users
- **Webhook Handling**: Secure Stripe webhook processing
- **Audit Logging**: Comprehensive audit trail for all admin actions
- **Authentication**: JWT-based authentication with admin role management
- **Database Integration**: PostgreSQL with optimized queries

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- Stripe account with API keys

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
# - Database connection string
# - Stripe API keys
# - JWT secret
# - App base URL
```

### Environment Variables

```bash
# Server
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/swipe_type_db

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
APP_BASE_URL=http://localhost:8081
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8081
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Admin API (`/api/admin`)

- `GET /purchases` - List purchases with filtering
- `GET /purchase/:id` - Get purchase details
- `POST /refund` - Issue refund
- `POST /grant-access` - Manually grant premium access
- `POST /revoke-access` - Revoke premium access
- `GET /stats` - Admin dashboard statistics
- `GET /search` - Search purchases
- `POST /export` - Export purchase data

### Payment API (`/api/payment`)

- `POST /create-checkout` - Create Stripe checkout session
- `POST /verify-unlock` - Verify payment and unlock content
- `GET /check-access` - Check premium access status
- `GET /receipt` - Get purchase receipt

### Webhook API (`/api/webhook`)

- `POST /stripe` - Handle Stripe webhook events

## Database Schema

### Tables

- `purchases` - Payment records
- `premium_access` - Premium access grants
- `audit_log` - Admin action audit trail
- `users` - User accounts
- `assessment_sessions` - Assessment data

### Key Relationships

- Users have many purchases
- Purchases grant premium access
- Admin actions are logged in audit_log
- Premium access can be granted/revoked

## Security

### Authentication

- JWT tokens for API access
- Admin role required for admin endpoints
- Rate limiting on all API routes
- Stricter limits on admin routes

### Webhook Security

- Stripe signature verification
- Webhook secret validation
- Idempotency handling
- Error logging and monitoring

### Data Protection

- Input validation on all endpoints
- SQL injection prevention
- XSS protection with helmet
- CORS configuration

## Development

### Project Structure

```
backend/
├── app.js              # Express app configuration
├── server.js           # Server entry point
├── middleware/
│   └── auth.js         # Authentication middleware
├── routes/
│   ├── admin.js        # Admin API routes
│   ├── payment.js      # Payment API routes
│   └── webhook.js      # Webhook handlers
├── utils/
│   └── audit.js        # Audit logging utilities
└── package.json        # Dependencies and scripts
```

### Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

### Linting

```bash
# Check for issues
npm run lint

# Fix issues
npm run lint:fix
```

## Production Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Use production database
3. Use live Stripe keys
4. Set secure JWT secret
5. Configure CORS for production domains

### Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure JWT secret
- [ ] Use production Stripe keys
- [ ] Configure proper CORS origins
- [ ] Set up database SSL
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging

### Database Setup

1. Run migrations to create tables
2. Set up RLS policies
3. Create indexes for performance
4. Set up backup strategy

### Stripe Setup

1. Configure webhook endpoints
2. Set up webhook secret
3. Test webhook events
4. Monitor payment processing

## Monitoring

### Health Checks

- `GET /health` - Basic health check
- Database connectivity
- Stripe API connectivity

### Logging

- Request/response logging
- Error logging with stack traces
- Audit trail for admin actions
- Webhook event logging

### Metrics

- Request counts and response times
- Payment success/failure rates
- Admin action frequency
- Database query performance

## Troubleshooting

### Common Issues

1. **Database Connection**: Check DATABASE_URL
2. **Stripe Webhooks**: Verify webhook secret
3. **JWT Errors**: Check JWT_SECRET
4. **CORS Issues**: Check ALLOWED_ORIGINS

### Debug Mode

```bash
NODE_ENV=development npm run dev
```

## Support

For issues and questions:
- Check the logs for error details
- Verify environment variables
- Test with Stripe test mode
- Check database connectivity

## License

MIT License - see LICENSE file for details.



