# Docker Quick Start Guide

## 🐳 Prerequisites
- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Compose (included with Docker Desktop)

## 🚀 Quick Start (New PC Setup)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd training_center
```

### 2. Start with Docker
```bash
# Start all services (MySQL, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 3. Access the Application
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8000
- **MySQL**: localhost:3306

### 4. Default Credentials
```
Admin:
Email: admin@example.com
Password: password

Learner:
Email: learner@example.com
Password: password
```

## 🔧 Docker Commands

### Service Management
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart a specific service
docker-compose restart backend
docker-compose restart frontend

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild containers (after code changes)
docker-compose up -d --build
```

### Database Operations
```bash
# Run migrations
docker-compose exec backend php artisan migrate

# Seed database
docker-compose exec backend php artisan db:seed

# Fresh database (drop all tables and reseed)
docker-compose exec backend php artisan migrate:fresh --seed

# Access MySQL
docker-compose exec mysql mysql -u training_user -ptraining_password training_center
```

### Laravel Commands
```bash
# Clear cache
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear

# Generate app key
docker-compose exec backend php artisan key:generate

# Access Laravel Tinker
docker-compose exec backend php artisan tinker
```

### Frontend Commands
```bash
# Install npm packages
docker-compose exec frontend npm install

# Build production
docker-compose exec frontend npm run build
```

## 📝 Environment Variables

### Backend (.env)
The backend `.env` file is automatically configured for Docker:
- `DB_HOST=mysql` (Docker service name)
- `DB_PORT=3306`
- `DB_DATABASE=training_center`
- `DB_USERNAME=training_user`
- `DB_PASSWORD=training_password`
- `FRONTEND_URL=http://localhost:4200`

### Frontend (environment.ts)
Already configured to use `http://localhost:8000/api`

## 🔄 Switching to a New PC

1. **Commit and push your changes** (on old PC):
```bash
git add .
git commit -m "Your changes"
git push
```

2. **On new PC**:
```bash
git clone <repository-url>
cd training_center
docker-compose up -d
```

That's it! Everything runs in Docker containers.

## 🛠 Troubleshooting

### Port Conflicts
If ports 3306, 4200, or 8000 are already in use:

Edit `docker-compose.yml`:
```yaml
ports:
  - "3307:3306"  # Change MySQL port
  - "4201:4200"  # Change Frontend port
  - "8001:8000"  # Change Backend port
```

### Reset Everything
```bash
# Stop and remove all containers, volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d --build
```

### View Container Status
```bash
docker-compose ps
docker-compose top
```

### Access Container Shell
```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# MySQL
docker-compose exec mysql bash
```

## 📦 What's Included

- **MySQL 8.0**: Database with persistent volume
- **PHP 8.2**: Laravel backend with all extensions
- **Node.js 18**: Angular frontend
- **Auto-setup**: Database migrations and seeding run automatically

## 🎯 Development Workflow

1. Make code changes in your editor
2. Backend: Changes auto-reload with Laravel dev server
3. Frontend: Changes auto-reload with Angular dev server
4. Database: Data persists in Docker volume

No need to manually restart services!

## 📊 Production Deployment

For production, modify `docker-compose.yml`:
- Use environment-specific `.env` files
- Enable HTTPS
- Use production builds
- Add nginx reverse proxy
- Configure proper secrets

## 🆘 Support

If containers fail to start:
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

Check for:
- Port conflicts
- Missing `.env` file in backend
- Insufficient Docker resources (RAM/CPU)
