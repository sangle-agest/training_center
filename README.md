# Training Center Application

A comprehensive e-learning platform built with Laravel (Backend) and Angular (Frontend).

## 📋 Table of Contents
- [Quick Start with Docker](#-quick-start-with-docker)
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Current Implementation Status](#current-implementation-status)
- [Setup Instructions](#setup-instructions)
- [Database Structure](#database-structure)
- [API Endpoints](#api-endpoints)
- [Features Implemented](#features-implemented)
- [Features To Be Implemented](#features-to-be-implemented)
- [Known Issues](#known-issues)

## 🐳 Quick Start with Docker

**Recommended for easy PC switching and setup!**

```bash
# 1. Clone and start
git clone <repository-url>
cd training_center
docker-compose up -d

# 2. Access the application
# Frontend: http://localhost:4200
# Backend: http://localhost:8000
# Database: localhost:3306

# 3. Login credentials
# Admin: admin@example.com / password
# Learner: learner@example.com / password
```

**📖 Full Docker documentation**: See [DOCKER.md](DOCKER.md)

---

## 🎯 Project Overview

Training Center is an e-learning management system with role-based access (Admin and Learner). The platform uses a hierarchical content structure: **Courses → Categories → Lessons**.

### Key Features:
- 👨‍💼 **Admin**: Create/manage courses, organize content with drag-and-drop, WYSIWYG lesson editor
- ��‍🎓 **Learner**: Browse courses, track progress, view lessons
- 🔐 **Authentication**: Token-based with Sanctum
- 📱 **Responsive**: Modern UI with card/table views

## 🛠 Technology Stack

### Backend
- **Framework**: Laravel 12.44.0
- **Database**: MySQL (via XAMPP)
- **Authentication**: Laravel Sanctum
- **API**: RESTful architecture

### Frontend
- **Framework**: Angular 21.0.4
- **Components**: Standalone components
- **Editor**: ngx-editor (WYSIWYG HTML editor)
- **Drag & Drop**: Angular CDK
- **Routing**: Angular Router with guards

### Development Environment
- **PHP**: 8.2+
- **Node.js**: 18+
- **Docker**: Recommended for easy setup
- **Ports**: Backend (8000), Frontend (4200), MySQL (3306)

## ✅ Current Implementation Status

### ✅ Completed Features

#### Backend (100%)
- [x] Database migrations (courses, categories, lessons, users, progress tracking)
- [x] All models with relationships and ordering
- [x] Authentication API (login, register, logout)
- [x] Course CRUD API
- [x] Category CRUD API with order management
- [x] Lesson CRUD API with order management
- [x] Middleware for role-based access (admin/learner)
- [x] Database seeder (3 courses, 9 categories, 27 lessons)

#### Frontend - Admin (90%)
- [x] Login/authentication with persistence
- [x] Admin dashboard
- [x] Course list with card/table view toggle
- [x] Course create/edit form
- [x] Category management with drag-and-drop reordering
- [x] Lesson editor component (navigate to separate page)
- [x] WYSIWYG HTML editor for lesson content (ngx-editor)
- [x] Drag-and-drop lesson reordering within categories
- [x] Order persistence in database
- [x] Change detection fixes for UI updates
- [ ] File upload for lesson attachments (TODO)

#### Frontend - Learner (0%)
- [ ] Learner dashboard (TODO)
- [ ] Browse available courses (TODO)
- [ ] View course details with categories/lessons (TODO)
- [ ] Lesson viewer (TODO)
- [ ] Progress tracking (TODO)

### ⚠️ Known Issues
1. **Login page flash on refresh**: APP_INITIALIZER implemented but still shows brief flash (minor UX issue)
2. **ngx-editor styles**: Currently using inline CSS - editor works but could be improved

## 🚀 Setup Instructions

### Option 1: Docker (Recommended) 🐳

**See [DOCKER.md](DOCKER.md) for complete Docker setup guide.**

```bash
docker-compose up -d
```

Everything runs automatically:
- MySQL database created and seeded
- Backend migrations run
- Frontend ready to use

### Option 2: Manual Setup

#### Prerequisites
```bash
# Install XAMPP (MySQL) or use Docker MySQL
# Start Apache and MySQL from XAMPP control panel

# Verify installations
php --version  # Should be 8.2+
node --version # Should be 18+
```

#### Backend Setup
```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=training_center
DB_USERNAME=root
DB_PASSWORD=

# Generate key
php artisan key:generate

# Run migrations and seeder
php artisan migrate:fresh --seed

# Start server
php artisan serve
# Backend runs on: http://localhost:8000
```

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
# Frontend runs on: http://localhost:4200
```

### Test Accounts (from seeder)
```
Admin:
Email: admin@training.com
Password: password

Learner:
Email: learner@training.com
Password: password
```

## 🗄 Database Structure

### Hierarchical Structure
```
Course (title, description, is_active, created_by)
  └─> Category (name, order, course_id, parent_id)
       └─> Lesson (title, content, order, category_id)
            └─> LessonFile (filename, filepath, lesson_id)
            └─> LessonProgress (user_id, lesson_id, is_completed)
```

### Key Tables
- **users**: id, name, email, password, role (admin/learner)
- **courses**: id, title, description, is_active, created_by
- **categories**: id, name, order, course_id, parent_id
- **lessons**: id, title, content, order, category_id
- **lesson_files**: id, filename, filepath, lesson_id
- **lesson_progress**: id, user_id, lesson_id, is_completed
- **course_assignments**: id, course_id, user_id, assigned_by

## 📡 API Endpoints

### Authentication
```
POST   /api/register          - Register new user
POST   /api/login             - Login (returns token)
POST   /api/logout            - Logout (requires auth)
GET    /api/user              - Get current user
```

### Courses (Admin)
```
GET    /api/courses           - List all courses
GET    /api/courses/{id}      - Get course with categories & lessons
POST   /api/courses           - Create course
PUT    /api/courses/{id}      - Update course
DELETE /api/courses/{id}      - Delete course
```

### Categories (Admin)
```
GET    /api/categories        - List all categories
GET    /api/categories/{id}   - Get category details
POST   /api/categories        - Create category
PUT    /api/categories/{id}   - Update category (including order)
DELETE /api/categories/{id}   - Delete category
```

### Lessons (Admin)
```
GET    /api/lessons           - List all lessons
GET    /api/lessons/{id}      - Get lesson details
POST   /api/lessons           - Create lesson
PUT    /api/lessons/{id}      - Update lesson (including order)
DELETE /api/lessons/{id}      - Delete lesson
```

### Progress (Learner)
```
GET    /api/progress          - Get user's progress
POST   /api/progress          - Mark lesson complete
```

## 🎨 Features Implemented

### Admin Interface
1. **Course Management**
   - Create/Edit/Delete courses
   - Toggle active status
   - View switcher (cards/table)
   - Navigate to "Manage" for content organization

2. **Category & Lesson Organization**
   - Drag-and-drop reordering (☰ handles)
   - Category modal for quick edits
   - Separate page for lesson editing with WYSIWYG
   - Order saved to database automatically

3. **Lesson Editor**
   - Rich text editor (ngx-editor)
   - Formatting tools: bold, italic, headings, lists
   - Links and images support
   - HTML content storage
   - Category selection dropdown

### Authentication
- Token-based with localStorage
- Auto-redirect based on role
- Auth guards for routes
- HTTP interceptor for API calls

## 📝 Features To Be Implemented

### High Priority
1. **Learner Interface** (NOT STARTED)
   ```
   Components needed:
   - /learn (dashboard) - List assigned courses
   - /learn/courses/:id - View course structure
   - /learn/lessons/:id - View lesson content
   ```
   
2. **Progress Tracking** (NOT STARTED)
   - Mark lessons as complete
   - Progress percentage per course
   - Progress API integration
   - Visual progress indicators

3. **Course Assignment** (API exists, UI NOT STARTED)
   - Admin assigns courses to learners
   - Learners see only assigned courses
   - Assignment management interface

4. **File Attachments** (NOT STARTED)
   - Upload files to lessons
   - Download files in learner view
   - File type validation
   - Storage management

### Medium Priority
5. **User Management** (NOT STARTED)
   - Admin: Create/edit/delete users
   - Role management
   - User list with filters

6. **Search & Filters** (NOT STARTED)
   - Search courses by title
   - Filter by status (active/inactive)
   - Category search

7. **Nested Categories** (DB ready, UI NOT STARTED)
   - parent_id field exists
   - Support subcategories
   - Tree view for categories

### Low Priority
8. **Dashboard Statistics** (BASIC ONLY)
   - Admin: Total courses, learners, completion rates
   - Learner: Enrolled courses, completed lessons

9. **Notifications** (NOT STARTED)
   - New course assignments
   - Course updates
   - Completion notifications

10. **Settings** (NOT STARTED)
    - Profile management
    - Change password
    - Preferences

## 🔧 Development Notes

### Important Paths
```
Backend:
- Controllers: backend/app/Http/Controllers/Api/
- Models: backend/app/Models/
- Migrations: backend/database/migrations/
- Seeder: backend/database/seeders/DatabaseSeeder.php

Frontend:
- Admin Components: frontend/src/app/components/admin/
- Services: frontend/src/app/services/
- Routes: frontend/src/app/app.routes.ts
- Guards: frontend/src/app/guards/auth.guard.ts
```

### Key Services (Frontend)
- `AuthService`: Login, logout, current user
- `CourseService`: Course CRUD
- `CategoryService`: Category CRUD
- `LessonService`: Lesson CRUD
- `ProgressService`: Track completion (ready, not used yet)

### Drag & Drop Implementation
The drag-and-drop uses Angular CDK:
1. Categories can be reordered within a course
2. Lessons can be reordered within a category
3. Order updates are sent to API automatically
4. Database stores order value
5. All queries use `ORDER BY order` clause

### Change Detection Fix
Manual change detection is used in several places:
```typescript
constructor(private cdr: ChangeDetectorRef) {}
this.cdr.detectChanges(); // After data loads
```

## 🐛 Troubleshooting

### Backend not starting
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Check database connection
php artisan migrate:status
```

### Frontend compilation errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Angular cache
npx ng cache clean
```

### CORS issues
Already configured in backend:
```php
// bootstrap/app.php has CORS middleware
```

## 📞 Next Steps for Development

### Immediate Tasks (for next developer):
1. **Implement Learner Dashboard** (`/learn`)
   - List assigned courses
   - Show progress percentages
   - Quick access to continue learning

2. **Course View for Learners** (`/learn/courses/:id`)
   - Display course structure (categories/lessons)
   - Show completion status per lesson
   - Start lesson button

3. **Lesson Viewer** (`/learn/lessons/:id`)
   - Render HTML content from lesson
   - Previous/Next navigation
   - Mark as complete button
   - Call ProgressService.markComplete()

4. **Progress API Integration**
   - Connect frontend ProgressService to backend
   - Update UI when lessons marked complete
   - Calculate and display percentages

### Code Structure to Follow:
- Use standalone components
- Include CommonModule, FormsModule, RouterModule
- Call `this.cdr.detectChanges()` after async data loads
- Follow existing naming: `component-name.ts/html/css`
- Use existing services (already created)

## 📄 License

This project is for educational/internal use.

---
**Last Updated**: January 6, 2026  
**Status**: Admin features complete, Learner features pending  
**Commit**: f750ab6
