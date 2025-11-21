# Persian Kerman Carpet Luxury Landing Page

This is a code bundle for Persian Kerman Carpet Luxury Landing Page. The original project is available at https://www.figma.com/design/qt04FLbV8v3s6EA7NChJju/Persian-Kerman-Carpet-Luxury-Landing-Page.

## Running the code

### Development (Local)

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

### Production (Docker)

#### First time setup:

```bash
# Copy environment file
cp .env.example .env

# Edit .env and set your configuration
nano .env
```

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

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Stop and remove volumes (clean database)
docker compose down -v
```

## Features

- ✅ Sign In / Get Started buttons in Navigation
- ✅ Responsive design (Desktop & Mobile)
- ✅ Docker support with Nginx
- ✅ Backend API ready
- ✅ PostgreSQL database