# 🎓 Training Center - Project Overview & Learning Guide

## 📊 Current Implementation Status

### ✅ What's Working (90% Complete)
- **Backend API**: 100% complete with all CRUD operations
- **Admin Frontend**: 90% complete (missing file uploads)
- **Authentication**: Full token-based auth with role guards
- **Course Management**: Complete CRUD with drag-drop ordering
- **Category Management**: Complete with nested structure support
- **Lesson Editor**: WYSIWYG editor with content management

### ❌ What's Missing (10%)
- **Learner Dashboard**: Not implemented yet
- **File Upload**: UI not implemented (API exists)
- **Progress Tracking UI**: Backend ready, frontend missing
- **Course Assignment UI**: Backend ready, frontend missing

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Angular)                    │
│                 http://localhost:4200                    │
├─────────────────────────────────────────────────────────┤
│  Components                                              │
│  ├── Login (auth)                                       │
│  ├── Admin                                              │
│  │   ├── Dashboard                                      │
│  │   ├── Course List/Edit                               │
│  │   ├── Category Manager (drag-drop)                   │
│  │   └── Lesson Editor (WYSIWYG)                        │
│  └── Learner (NOT IMPLEMENTED)                          │
│      ├── Dashboard (TODO)                               │
│      ├── Course Viewer (TODO)                           │
│      └── Progress Tracker (TODO)                        │
├─────────────────────────────────────────────────────────┤
│  Services                                                │
│  ├── AuthService (token management)                     │
│  ├── CourseService (HTTP calls)                         │
│  ├── CategoryService (HTTP calls)                       │
│  ├── LessonService (HTTP calls)                         │
│  └── ProgressService (HTTP calls)                       │
├─────────────────────────────────────────────────────────┤
│  Guards                                                  │
│  ├── authGuard (protect routes)                         │
│  ├── loginGuard (prevent logged-in access)              │
│  └── roleGuard (admin/learner separation)               │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTP (REST API)
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (Laravel)                      │
│                 http://localhost:8000                    │
├─────────────────────────────────────────────────────────┤
│  API Endpoints (REST)                                    │
│  ├── /api/auth/* (login, register, logout, me)         │
│  ├── /api/courses/* (CRUD)                             │
│  ├── /api/categories/* (CRUD + reorder)                │
│  ├── /api/lessons/* (CRUD)                             │
│  ├── /api/upload/* (images + files)                    │
│  ├── /api/progress/* (learner progress)                │
│  └── /api/courses/{id}/assign (assign to learners)     │
├─────────────────────────────────────────────────────────┤
│  Middleware                                              │
│  ├── auth:sanctum (token verification)                  │
│  └── role:admin|learner (role-based access)             │
├─────────────────────────────────────────────────────────┤
│  Models & Relationships                                  │
│  ├── User (admin/learner)                               │
│  ├── Course → hasMany Categories                        │
│  ├── Category → hasMany Lessons, Categories (nested)    │
│  ├── Lesson → hasMany LessonFiles                       │
│  ├── CourseAssignment (user ↔ course)                   │
│  └── LessonProgress (completion tracking)               │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                  DATABASE (MySQL)                        │
│                 localhost:3307 (Docker)                  │
│  Tables: users, courses, categories, lessons,           │
│          lesson_files, course_assignments,              │
│          lesson_progress                                 │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
training_center/
├── backend/                          # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/      # REST Controllers
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── CourseController.php
│   │   │   │   ├── CategoryController.php
│   │   │   │   ├── LessonController.php
│   │   │   │   ├── FileUploadController.php
│   │   │   │   ├── AssignmentController.php
│   │   │   │   └── ProgressController.php
│   │   │   └── Middleware/
│   │   │       └── CheckRole.php     # Role verification
│   │   └── Models/
│   │       ├── User.php              # Admin/Learner
│   │       ├── Course.php
│   │       ├── Category.php
│   │       ├── Lesson.php
│   │       ├── LessonFile.php
│   │       ├── CourseAssignment.php
│   │       └── LessonProgress.php
│   ├── database/
│   │   ├── migrations/               # DB schema
│   │   └── seeders/
│   │       └── DatabaseSeeder.php    # Test data
│   ├── routes/
│   │   └── api.php                   # API routes
│   └── .env                          # Configuration
│
├── frontend/                         # Angular SPA
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── login/                # Login page
│   │   │   ├── admin/                # Admin features
│   │   │   │   ├── dashboard/
│   │   │   │   ├── courses/
│   │   │   │   │   ├── course-list/
│   │   │   │   │   └── course-edit/
│   │   │   │   ├── categories/
│   │   │   │   │   └── category-manager/
│   │   │   │   └── lessons/
│   │   │   │       └── lesson-editor/
│   │   │   └── learner/              # ⚠️ NOT IMPLEMENTED
│   │   ├── services/
│   │   │   ├── auth.service.ts       # Token + user state
│   │   │   ├── course.service.ts     # HTTP calls
│   │   │   ├── category.service.ts
│   │   │   ├── lesson.service.ts
│   │   │   └── progress.service.ts
│   │   ├── guards/
│   │   │   ├── auth.guard.ts         # Protect routes
│   │   │   ├── login.guard.ts        # Redirect if logged in
│   │   │   └── role.guard.ts         # Admin/learner check
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts   # Add token to requests
│   │   ├── models/                   # TypeScript interfaces
│   │   └── app.routes.ts             # Routing config
│   └── angular.json
│
├── docker-compose.yml                # Docker setup
├── DOCKER.md                         # Docker guide
├── README.md                         # Main docs
├── REQUIREMENTS.md                   # Full specs
└── PROJECT_OVERVIEW.md              # This file
```

---

## 🗄️ Database Schema

### Content Hierarchy
```
Course (1)
├── created_by → User (admin)
├── is_active (boolean)
└── Categories (N)
    ├── parent_id (self-reference for nesting)
    ├── order (integer for sorting)
    └── Lessons (N)
        ├── order (integer for sorting)
        ├── content (HTML text)
        └── LessonFiles (N)
            ├── filename
            └── filepath
```

### User Management
```
User
├── role (admin/learner)
├── Courses Created (if admin)
├── CourseAssignments (if learner)
│   ├── course_id
│   ├── assigned_by (admin_id)
│   └── assigned_at
└── LessonProgress
    ├── lesson_id
    ├── is_completed (boolean)
    └── completed_at
```

### Key Relationships
```sql
-- Course belongs to User (creator)
courses.created_by → users.id

-- Category belongs to Course
categories.course_id → courses.id

-- Category can have parent (nested structure)
categories.parent_id → categories.id

-- Lesson belongs to Category
lessons.category_id → categories.id

-- LessonFile belongs to Lesson
lesson_files.lesson_id → lessons.id

-- CourseAssignment (many-to-many: User ↔ Course)
course_assignments.user_id → users.id
course_assignments.course_id → courses.id

-- LessonProgress (many-to-many: User ↔ Lesson)
lesson_progress.user_id → users.id
lesson_progress.lesson_id → lessons.id
```

---

## 🔐 Authentication Flow

### 1. Login Process
```
User enters credentials
    ↓
POST /api/auth/login
    ↓
Laravel validates & creates token
    ↓
Response: { user: {...}, token: "..." }
    ↓
Frontend stores:
  - localStorage.setItem('token', ...)
  - localStorage.setItem('user', JSON.stringify(user))
    ↓
AuthService.currentUser$ = BehaviorSubject(user)
```

### 2. Authenticated Requests
```
HTTP Request
    ↓
AuthInterceptor adds header:
  Authorization: Bearer {token}
    ↓
Backend middleware auth:sanctum verifies token
    ↓
CheckRole middleware verifies role
    ↓
Controller processes request
```

### 3. Route Protection
```
User navigates to /admin/dashboard
    ↓
authGuard checks: isAuthenticated()?
    ↓
roleGuard checks: user.role === 'admin'?
    ↓
Both pass → Load component
    ↓
Component fetches data via service
```

---

## 🎯 Key Features Explained

### 1. Drag & Drop Ordering
**Files:**
- `frontend/src/app/components/admin/categories/category-manager/`

**How it works:**
1. Uses Angular CDK `CdkDragDrop`
2. Categories/Lessons have `order` field in DB
3. On drop event, frontend:
   - Calculates new order for all items
   - Calls `POST /api/categories/reorder`
4. Backend updates `order` column for affected items

### 2. WYSIWYG Lesson Editor
**Files:**
- `frontend/src/app/components/admin/lessons/lesson-editor/`

**Tech:**
- `ngx-editor` library (Prosemirror-based)
- Toolbar: bold, italic, headings, lists, links
- Stores HTML in `lessons.content` column

### 3. Nested Categories
**Implementation:**
- Categories table has `parent_id` (self-referencing foreign key)
- Backend: `Category::with('children')` eager loads nested structure
- Frontend: Recursively renders tree structure

---

## 🚀 What You Can Implement Next

### 🟢 Easy Tasks (Good for Learning)

#### 1. **File Upload UI** (4-6 hours)
**What:** Add file upload to lesson editor
**Files to modify:**
- `frontend/src/app/components/admin/lessons/lesson-editor/`
- Use `<input type="file">` + FormData
**Backend already done:** `POST /api/lessons/{id}/files`

#### 2. **Course Assignment UI** (3-4 hours)
**What:** Admin can assign courses to learners
**Files to modify:**
- Create new component: `admin/courses/course-assign/`
- Fetch learners: `GET /api/users?role=learner` (needs new endpoint)
- Assign: `POST /api/courses/{id}/assign`

#### 3. **Delete Confirmation Modals** (2-3 hours)
**What:** Show "Are you sure?" before deleting
**Files to modify:**
- `admin/courses/course-list/`
- Use Angular Material Dialog or simple confirm()

### 🟡 Medium Tasks

#### 4. **Learner Dashboard** (8-12 hours)
**What:** Build complete learner interface
**Components to create:**
```
learner/
├── dashboard.component.ts       # List assigned courses
├── course-viewer.component.ts   # Show course tree
├── lesson-viewer.component.ts   # Display lesson content
└── progress.component.ts        # Show completion status
```
**Backend endpoints exist:**
- `GET /api/progress/my-courses`
- `GET /api/courses/{id}/tree`
- `GET /api/lessons/{id}`
- `POST /api/progress/lesson/{id}` (mark complete)

#### 5. **Course Search & Filtering** (4-6 hours)
**What:** Add search bar to course list
**Files to modify:**
- `admin/courses/course-list/`
- Add search input + filter logic
- Optionally add backend pagination

#### 6. **Image Upload in Lesson Editor** (5-7 hours)
**What:** Paste/upload images directly in WYSIWYG
**Tech:**
- `POST /api/upload/image` exists
- Integrate with ngx-editor image plugin
- Return URL and insert into content

### 🔴 Advanced Tasks

#### 7. **Real-time Progress Analytics** (12-16 hours)
**What:** Admin dashboard with charts
**Features:**
- Show completion rates per course
- Learner activity timeline
- Use Chart.js or ngx-charts
**Backend:** Create new analytics endpoints

#### 8. **Course Duplication** (6-8 hours)
**What:** Clone existing course with all content
**Implementation:**
- Add "Duplicate" button in course list
- Backend: Deep copy course + categories + lessons
- Handle file copies

#### 9. **Rich Comments System** (16-24 hours)
**What:** Learners can ask questions on lessons
**Database:**
- New table: `lesson_comments`
- Relations: User → Comment, Lesson → Comments
**Features:**
- Add comment form below lesson content
- Admin can reply
- Email notifications

---

## 🛠️ Development Workflow

### Making Changes

#### Backend Changes
```bash
# 1. Edit files in backend/
# 2. If database changes needed:
docker compose exec backend php artisan make:migration create_xxx_table
docker compose exec backend php artisan migrate

# 3. Test endpoints:
curl -X GET http://localhost:8000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Frontend Changes
```bash
# 1. Edit files in frontend/
# 2. Changes auto-reload (hot reload enabled)
# 3. Check browser console for errors

# Create new component:
docker compose exec frontend ng generate component components/learner/dashboard
```

### Testing Flow
1. **Backend:** Use Postman/Insomnia or curl to test API
2. **Frontend:** Use browser DevTools → Network tab
3. **Database:** Check data with:
   ```bash
   docker compose exec mysql mysql -u training_user -ptraining_password training_center
   ```

---

## 📚 Learning Resources

### Key Concepts to Understand

#### 1. Laravel Eloquent Relationships
**Read:**
- `backend/app/Models/*.php`
- Notice: `belongsTo`, `hasMany`, `with()` eager loading

**Try:**
```bash
docker compose exec backend php artisan tinker
# Then run:
$course = App\Models\Course::with('categories.lessons')->first();
dd($course->categories);
```

#### 2. Angular Services & Observables
**Read:**
- `frontend/src/app/services/*.service.ts`
- Notice: `HttpClient`, `BehaviorSubject`, `Observable`

**Pattern:**
```typescript
// Service makes HTTP call
getCourses(): Observable<Course[]> {
  return this.http.get<Course[]>('/api/courses');
}

// Component subscribes
this.courseService.getCourses().subscribe(courses => {
  this.courses = courses;
});
```

#### 3. Route Guards
**Read:**
- `frontend/src/app/guards/*.guard.ts`
- `frontend/src/app/app.routes.ts`

**How they work:**
```typescript
// Route definition
{
  path: 'admin',
  canActivate: [authGuard, roleGuard],
  data: { role: 'admin' }
}

// Guard checks conditions before loading route
```

---

## 🐛 Common Issues & Solutions

### Issue: "Token expired" after some time
**Solution:** Add token refresh logic or extend expiration in `config/sanctum.php`

### Issue: CORS errors
**Solution:** Check `config/cors.php`, ensure frontend URL is allowed

### Issue: Changes not reflecting
**Frontend:** Clear browser cache, hard refresh (Ctrl+Shift+R)
**Backend:** Clear Laravel cache:
```bash
docker compose exec backend php artisan cache:clear
docker compose exec backend php artisan config:clear
```

### Issue: Database out of sync
**Solution:**
```bash
docker compose exec backend php artisan migrate:fresh --seed
# WARNING: Deletes all data!
```

---

## 💡 Best Practices

### Backend
- ✅ Use Eloquent relationships instead of manual joins
- ✅ Validate input with Form Requests
- ✅ Use resource transformers for API responses
- ✅ Keep controllers thin, logic in services/models

### Frontend
- ✅ Use services for HTTP calls (not components)
- ✅ Unsubscribe from observables in `ngOnDestroy()`
- ✅ Use async pipe in templates when possible
- ✅ Keep components focused (single responsibility)

---

## 📞 Quick Command Reference

### Docker
```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Restart service
docker compose restart backend

# Stop all
docker compose down

# Rebuild after Dockerfile changes
docker compose up -d --build
```

### Laravel Artisan
```bash
# Run in container
docker compose exec backend php artisan [command]

# Useful commands:
php artisan route:list          # Show all API routes
php artisan migrate:fresh --seed # Reset database
php artisan tinker              # REPL console
php artisan make:controller Api/XxxController --api
php artisan make:model Xxx -m   # Model + migration
```

### Angular CLI
```bash
# Run in container
docker compose exec frontend ng [command]

# Useful commands:
ng generate component components/xxx
ng generate service services/xxx
ng serve --host 0.0.0.0         # Already in package.json
```

---

## 🎯 Next Steps for You

1. **Explore the codebase:**
   - Read `backend/routes/api.php` to understand all endpoints
   - Check `frontend/src/app/app.routes.ts` for routing
   - Look at existing components to understand patterns

2. **Try a small feature:**
   - Start with "Delete Confirmation Modal" (easy win)
   - Or "File Upload UI" (practical and useful)

3. **Build the Learner Dashboard:**
   - This is the biggest missing piece
   - Backend is ready, just needs frontend
   - Great learning opportunity!

4. **Ask questions:**
   - What feature do you want to implement first?
   - Need help understanding any part?
   - Want to review the code together?

---

**Ready to build something? What would you like to implement first?** 🚀
