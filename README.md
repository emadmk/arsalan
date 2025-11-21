# Persian Kerman Carpet - Full Stack E-Commerce Platform

A complete e-commerce platform for selling Persian Kerman carpets with cryptocurrency payment integration, admin dashboard, and user management.

## Features

### Authentication & User Management
- ✅ **Sign In / Sign Up** - Complete authentication system with JWT
- ✅ **User Roles** - Admin and regular user access levels
- ✅ **Session Management** - Secure token-based authentication
- ✅ **Password Encryption** - bcrypt hashing for security

### Admin Features
- ✅ **Admin Dashboard** - Comprehensive admin panel
- ✅ **Product Management** - Add, edit, delete products
- ✅ **Order Management** - View and manage all orders
- ✅ **User Management** - Manage user accounts
- ✅ **Analytics** - Sales and order statistics

### User Features
- ✅ **User Dashboard** - Personal dashboard for customers
- ✅ **Order History** - View all past and current orders
- ✅ **Certificate Download** - PDF certificates for purchases
- ✅ **Payment Tracking** - Track cryptocurrency payments

### Payment & Orders
- ✅ **Crypto Payment Gateway** - NOWPayments integration (Bitcoin, Ethereum, etc.)
- ✅ **Order Processing** - Complete order management system
- ✅ **Email Notifications** - Order confirmations and updates
- ✅ **Certificate Generation** - Automated PDF certificate creation

### Technical Features
- ✅ **PostgreSQL Database** - Robust data persistence
- ✅ **Docker Support** - Easy deployment with Docker Compose
- ✅ **Responsive Design** - Beautiful UI for all devices
- ✅ **RESTful API** - Clean and documented backend API
- ✅ **TypeScript** - Type-safe code for both frontend and backend

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite (Build tool)
- React Router (Navigation)
- Zustand (State Management)
- TailwindCSS (Styling)
- Radix UI (Component Library)
- Axios (HTTP Client)
- React Hook Form (Forms)
- Recharts (Analytics)

**Backend:**
- Node.js + Express
- TypeScript
- PostgreSQL (Database)
- JWT Authentication
- bcrypt (Password hashing)
- NOWPayments API (Crypto payments)
- Nodemailer (Email service)
- PDFKit (Certificate generation)

## Running the code

### Development (Local)

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
```bash
# Frontend environment
cp .env.frontend.example .env.local

# Backend environment
cp .env.example .env

# Edit the files with your configuration
nano .env.local
nano .env
```

3. **Start development server:**
```bash
npm run dev
```

The app will be available at http://localhost:3000

### Production (Docker)

#### First time setup:

```bash
# Copy environment files
cp .env.example .env
cp .env.frontend.example .env.local

# Edit .env and set your configuration
nano .env
```

**Required environment variables:**
- `JWT_SECRET` - Secret key for JWT tokens
- `DB_PASSWORD` - PostgreSQL password
- `NOWPAYMENTS_API_KEY` - NOWPayments API key
- `NOWPAYMENTS_IPN_SECRET` - NOWPayments IPN secret
- `SMTP_USER` - Email address for notifications
- `SMTP_PASS` - Email password
- `ADMIN_EMAIL` - Admin account email
- `ADMIN_PASSWORD` - Admin account password

#### Running with Docker Compose:

```bash
# Pull latest changes
git pull origin claude/fix-auth-buttons-015AwAfjmShNgmAnRfnyrMLd

# Stop and remove frontend (for clean rebuild)
docker compose stop frontend
docker compose rm -f frontend

# Build frontend without cache
docker compose build frontend --no-cache

# Start frontend
docker compose up -d frontend

# Check if frontend is running
docker compose ps frontend

# View logs
docker compose logs -f frontend
```

#### Full stack (Frontend + Backend + Database):

```bash
# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs for all services
docker compose logs -f

# View logs for specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Stop all services
docker compose down

# Stop and remove volumes (clean database)
docker compose down -v

# Rebuild specific service
docker compose build backend --no-cache
docker compose build frontend --no-cache
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status
- `GET /api/admin/products` - Get all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/:id/certificate` - Download certificate PDF

### Webhooks
- `POST /api/webhook/nowpayments` - NOWPayments IPN callback

## Default Admin Account

After first deployment, you can login with:
- **Email:** admin@example.com (or value from `ADMIN_EMAIL` in `.env`)
- **Password:** Admin123!@# (or value from `ADMIN_PASSWORD` in `.env`)

⚠️ **Important:** Change the default admin password immediately after first login!

## Project Structure

```
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── types/          # TypeScript types
│   ├── Dockerfile
│   └── package.json
├── src/                     # Frontend React app
│   ├── components/         # React components
│   │   ├── auth/           # Authentication components
│   │   └── ui/             # UI components
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages
│   │   └── user/           # User pages
│   ├── lib/                # Utility libraries
│   ├── store/              # Zustand stores
│   └── App.tsx
├── docker-compose.yml       # Docker orchestration
├── Dockerfile.frontend      # Frontend Docker build
└── nginx.conf               # Nginx configuration
```

## Troubleshooting

### Frontend not loading
```bash
# Check frontend logs
docker compose logs frontend

# Rebuild frontend
docker compose build frontend --no-cache
docker compose up -d frontend
```

### Backend errors
```bash
# Check backend logs
docker compose logs backend

# Check database connection
docker compose logs postgres

# Restart backend
docker compose restart backend
```

### Database issues
```bash
# Reset database (WARNING: deletes all data)
docker compose down -v
docker compose up -d postgres

# Check database is ready
docker compose exec postgres pg_isready -U postgres
```

## Support

For issues or questions, please check the documentation or contact support.

## License

Private - All rights reserved
