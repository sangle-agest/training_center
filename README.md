# 🎓 Training Center Web App

Internal e-Learning platform for training new team members.

## 📋 Project Overview

A monorepo application with Laravel backend and Angular frontend for managing training courses and tracking learner progress.

**Version:** 1.0  
**Architecture:** Monorepo  
**Stack:** Laravel + Angular

## 📁 Project Structure

```
training_center/
├── backend/          # Laravel REST API
├── frontend/         # Angular Application
├── docs/            # Additional documentation
├── REQUIREMENTS.md  # Complete requirements specification
└── README.md        # This file
```

## 🚀 Quick Start

### Prerequisites

- PHP 8.1+
- Composer
- Node.js 18+ & npm
- MySQL/MariaDB (XAMPP)
- Angular CLI

### Backend Setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

Backend API will run on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
ng serve
```

Frontend will run on `http://localhost:4200`

## 👥 User Roles

### Admin / Trainer
- Create and manage courses, categories, lessons
- Upload images and files
- Assign courses to learners
- Track learner progress

### Learner / Trainee
- View assigned courses
- Navigate through training content
- Download lesson attachments
- Mark lessons as completed
- Track personal progress

## 🔧 Technology Stack

### Backend
- **Framework:** Laravel
- **API:** REST
- **Auth:** Laravel Sanctum
- **Database:** MySQL

### Frontend
- **Framework:** Angular
- **UI:** Angular Material
- **Editor:** CKEditor 5
- **HTTP:** HttpClient

## 📚 API Documentation

API endpoints are available at `/api/*`:

- **Auth:** `/api/auth/*`
- **Courses:** `/api/courses/*`
- **Categories:** `/api/categories/*`
- **Lessons:** `/api/lessons/*`
- **Files:** `/api/lessons/{id}/files/*`
- **Assignments:** `/api/courses/{id}/assign`
- **Progress:** `/api/progress/*`

## 🗄️ Database Schema

Main entities:
- Users
- Courses
- Categories (nested)
- Lessons
- Lesson Files
- Course Assignments
- Lesson Progress

See [REQUIREMENTS.md](REQUIREMENTS.md) for detailed schema.

## 🔐 Authentication

Token-based authentication using Laravel Sanctum:
1. Login via `/api/auth/login`
2. Receive token
3. Include token in Authorization header: `Bearer {token}`

## 📦 Features

### MVP Features
✅ Course management  
✅ Flexible content structure  
✅ WYSIWYG lesson editor  
✅ Image upload (drag & drop, paste)  
✅ File attachments (any type)  
✅ Course assignments  
✅ Progress tracking  
✅ Role-based access  

### Future Enhancements
- Drag & drop ordering
- Auto-save
- Quiz module
- Search functionality
- Analytics dashboard

## 🧪 Testing

```bash
# Backend tests
cd backend
php artisan test

# Frontend tests
cd frontend
ng test
```

## 📝 Development Workflow

1. Backend changes: Update models, migrations, controllers
2. Frontend changes: Update components, services
3. Test locally
4. Commit and push

## 🤝 Contributing

Internal project - team members only.

## 📄 License

Internal use only - All rights reserved.

## 📞 Support

Contact the development team for support and feature requests.

---

**Documentation:** See [REQUIREMENTS.md](REQUIREMENTS.md) for complete specifications.
