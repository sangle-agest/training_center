# 📘 Training Center Web App – Requirements Specification

**Version:** 1.0  
**Date:** January 6, 2026  
**Project Type:** Internal e-Learning Platform  
**Architecture:** Monorepo (Laravel Backend + Angular Frontend)

---

## 1. General Overview

### 1.1 Purpose
Internal web application for training new team members within the company.

### 1.2 Scope
- **Usage:** Internal only (company employees)
- **Security Level:** Minimal (internal trusted environment)
- **Focus:** Flexibility, speed, ease of content creation

### 1.3 Key Characteristics
- No strict security, file limits, or compliance requirements
- Flexible content structure
- Simple and intuitive user experience
- Focus on rapid content development

---

## 2. Tech Stack

### 2.1 Backend
- **Framework:** Laravel (Latest stable version)
- **API Type:** REST API
- **Authentication:** Laravel Sanctum or JWT
- **Database:** MySQL/PostgreSQL
- **Storage:** Local filesystem for uploads

### 2.2 Frontend
- **Framework:** Angular (Latest stable version)
- **Routing:** Role-based routing
- **UI Library:** Angular Material (recommended)
- **Rich Text Editor:** CKEditor 5 Classic

### 2.3 Project Structure
**Monorepo Structure:**
```
training_center/
├── backend/          # Laravel application
├── frontend/         # Angular application
├── docs/            # Documentation
└── README.md        # Project overview
```

---

## 3. User Roles & Permissions

### 3.1 Admin / Trainer Role

**Purpose:** Create and manage all training content

**Capabilities:**
- ✅ Create, edit, delete courses
- ✅ Create, rename, reorder categories & sub-categories
- ✅ Create, edit, delete lessons
- ✅ Edit lesson content using WYSIWYG editor
- ✅ Upload images (copy/paste or drag & drop)
- ✅ Upload any type of files to lessons
- ✅ Assign courses to learners
- ✅ View learner progress and statistics

### 3.2 Learner / Trainee Role

**Purpose:** Consume training content and track progress

**Capabilities:**
- ✅ View assigned courses only
- ✅ Navigate through categories → sub-categories → lessons
- ✅ View lesson content (text, images, embedded media)
- ✅ Download lesson attachments
- ✅ Mark lessons as completed
- ✅ Resume progress from last viewed lesson
- ✅ Track personal course completion

---

## 4. Content Structure

### 4.1 Hierarchy Model
```
Course
 └── Category (custom name)
      └── Sub-Category (custom name)
           └── Lesson
```

### 4.2 Flexibility Rules
- **No Fixed Naming:** Categories can have any name (e.g., "Day 1", "Week 1", "Module A")
- **Unlimited Nesting:** Categories support parent-child relationships
- **Custom Ordering:** Manual order configuration for all levels
- **Dynamic Structure:** Admins can restructure at any time

### 4.3 Entity Definitions

#### Course
- **Fields:**
  - `id` (primary key)
  - `title` (string, required)
  - `description` (text, optional)
  - `is_active` (boolean, default: true)
  - `created_by` (foreign key to users)
  - `created_at`, `updated_at` (timestamps)

#### Category
- **Fields:**
  - `id` (primary key)
  - `course_id` (foreign key)
  - `parent_id` (foreign key, nullable - for sub-categories)
  - `name` (string, required)
  - `order` (integer, default: 0)
  - `created_at`, `updated_at` (timestamps)

#### Lesson
- **Fields:**
  - `id` (primary key)
  - `category_id` (foreign key)
  - `title` (string, required)
  - `content` (longtext/html)
  - `order` (integer, default: 0)
  - `created_at`, `updated_at` (timestamps)

#### Lesson Files
- **Fields:**
  - `id` (primary key)
  - `lesson_id` (foreign key)
  - `filename` (string)
  - `original_name` (string)
  - `file_path` (string)
  - `file_size` (integer, bytes)
  - `mime_type` (string)
  - `uploaded_at` (timestamp)

---

## 5. Lesson Content Editor

### 5.1 WYSIWYG Editor Requirements
- **Editor:** CKEditor 5 (Classic Build)
- **Rich Text Features:**
  - Headings (H1-H6)
  - Paragraph formatting
  - Bold, Italic, Underline, Strikethrough
  - Bulleted and numbered lists
  - Links (URL insertion)
  - Tables
  - Code blocks (optional)
  - Blockquotes
  - Horizontal rules

### 5.2 Image Handling
**Upload Methods:**
- Copy & paste directly into editor
- Drag & drop images into editor
- Browse and upload button

**Backend Processing:**
1. Image uploaded to server
2. Server returns image URL
3. URL embedded in lesson HTML content
4. Images stored in `/storage/lessons/images/`

**Supported Formats:** JPG, PNG, GIF, WebP, SVG

### 5.3 Editor Implementation
```typescript
// Angular CKEditor Configuration
{
  toolbar: [
    'heading', '|',
    'bold', 'italic', 'link', '|',
    'bulletedList', 'numberedList', '|',
    'imageUpload', 'insertTable', 'blockQuote', '|',
    'undo', 'redo'
  ],
  image: {
    upload: {
      types: ['jpeg', 'png', 'gif', 'webp', 'svg+xml']
    }
  }
}
```

---

## 6. File Upload System

### 6.1 General Rules
- **File Types:** Any file type allowed (.pdf, .zip, .doc, .mp4, etc.)
- **File Size:** No strict limit (server configuration only)
- **Multiple Files:** Multiple files per lesson supported
- **Storage:** Local filesystem

### 6.2 Use Cases
- PDF documents
- ZIP archives
- Microsoft Office documents
- Images
- Videos
- Audio files
- Any internal training resources

### 6.3 File Management
**Admin Actions:**
- Upload files to lessons
- View uploaded files list
- Delete files from lessons
- Replace files

**Learner Actions:**
- View files list
- Download files
- No upload or delete permissions

### 6.4 API Endpoints
```
POST   /api/lessons/{id}/files        # Upload file
GET    /api/lessons/{id}/files        # List files
DELETE /api/lessons/{id}/files/{file} # Delete file
GET    /api/files/{id}/download       # Download file
```

---

## 7. Progress Tracking

### 7.1 Progress Model
**Entity: Lesson Progress**
- **Fields:**
  - `id` (primary key)
  - `user_id` (foreign key)
  - `lesson_id` (foreign key)
  - `completed` (boolean)
  - `completed_at` (timestamp, nullable)
  - `created_at`, `updated_at` (timestamps)

### 7.2 Progress Logic
- Learner manually marks lesson as completed
- Completion timestamp recorded
- Progress is per-user per-lesson
- Can mark as incomplete (toggle)

### 7.3 Progress Display
**Course Level:**
- Total lessons count
- Completed lessons count
- Progress percentage: `(completed / total) * 100`

**Lesson Level:**
- Completed checkmark indicator
- Last viewed timestamp

**Resume Feature:**
- Track last viewed lesson
- "Resume" button navigates to last lesson

---

## 8. Authentication & Authorization

### 8.1 Authentication
- **Method:** Token-based (Laravel Sanctum or JWT)
- **Login Required:** All routes require authentication
- **Session Management:** Token stored in localStorage/sessionStorage

**API Endpoints:**
```
POST /api/auth/register  # Admin only (create users)
POST /api/auth/login     # Email + password
POST /api/auth/logout    # Invalidate token
GET  /api/auth/me        # Get current user info
```

### 8.2 Authorization
**Role-Based Access Control:**
- Admin routes: Only admin role
- Learner routes: Only learner role
- Middleware: Check user role on each protected route

**Route Protection:**
```php
// Laravel Middleware
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Admin routes
});

Route::middleware(['auth:sanctum', 'role:learner'])->group(function () {
    // Learner routes
});
```

---

## 9. Backend Functional Requirements (Laravel)

### 9.1 API Modules

#### Authentication Module
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

#### Course Management Module
```
GET    /api/courses              # List all courses
POST   /api/courses              # Create course
GET    /api/courses/{id}         # Get course details
PUT    /api/courses/{id}         # Update course
DELETE /api/courses/{id}         # Delete course
GET    /api/courses/{id}/tree    # Get full course structure
```

#### Category Management Module
```
GET    /api/categories           # List categories
POST   /api/categories           # Create category
GET    /api/categories/{id}      # Get category
PUT    /api/categories/{id}      # Update category
DELETE /api/categories/{id}      # Delete category
POST   /api/categories/reorder   # Update order
```

#### Lesson Management Module
```
GET    /api/lessons              # List lessons
POST   /api/lessons              # Create lesson
GET    /api/lessons/{id}         # Get lesson
PUT    /api/lessons/{id}         # Update lesson
DELETE /api/lessons/{id}         # Delete lesson
```

#### File Upload Module
```
POST   /api/upload/image         # Upload editor image
POST   /api/lessons/{id}/files   # Upload lesson file
GET    /api/lessons/{id}/files   # List lesson files
DELETE /api/files/{id}            # Delete file
GET    /api/files/{id}/download  # Download file
```

#### Course Assignment Module
```
POST   /api/courses/{id}/assign       # Assign course to users
GET    /api/courses/{id}/learners     # Get assigned learners
DELETE /api/courses/{id}/unassign/{user} # Unassign
```

#### Progress Tracking Module
```
GET    /api/progress/course/{id}      # Get course progress
POST   /api/progress/lesson/{id}      # Mark lesson complete
GET    /api/progress/my-courses       # Learner's assigned courses
```

### 9.2 Database Schema

**Users Table:**
```sql
id, name, email, password, role (admin/learner), created_at, updated_at
```

**Courses Table:**
```sql
id, title, description, is_active, created_by, created_at, updated_at
```

**Categories Table:**
```sql
id, course_id, parent_id, name, order, created_at, updated_at
```

**Lessons Table:**
```sql
id, category_id, title, content (longtext), order, created_at, updated_at
```

**Lesson Files Table:**
```sql
id, lesson_id, filename, original_name, file_path, file_size, mime_type, uploaded_at
```

**Course Assignments Table:**
```sql
id, course_id, user_id, assigned_at, assigned_by
```

**Lesson Progress Table:**
```sql
id, user_id, lesson_id, completed, completed_at, created_at, updated_at
```

### 9.3 File Storage
```
storage/
├── app/
│   ├── public/
│   │   ├── lessons/
│   │   │   ├── images/     # Editor images
│   │   │   └── files/      # Lesson attachments
```

---

## 10. Frontend Functional Requirements (Angular)

### 10.1 Admin Module

#### Dashboard
- Course overview statistics
- Recent activity
- Quick actions

#### Course Management
- List all courses (table/grid)
- Create new course form
- Edit course details
- Delete course (with confirmation)
- Activate/deactivate courses

#### Course Structure Editor
- Tree view of categories and sub-categories
- Drag & drop reordering (future)
- Add/edit/delete categories
- Nested category support
- Visual hierarchy display

#### Lesson Editor
- WYSIWYG editor (CKEditor 5)
- Image upload integration
- File attachment manager
- Preview mode
- Auto-save (future enhancement)

#### Course Assignment
- List of learners
- Assign/unassign courses
- Bulk assignment
- View assigned courses per learner

#### Progress Overview
- Course completion statistics
- Learner progress per course
- Completion reports

### 10.2 Learner Module

#### My Courses
- List assigned courses
- Progress indicator per course
- Continue/Start button
- Course description

#### Course Navigation
- Expandable tree navigation
- Category → Sub-category → Lesson
- Progress indicators
- Current lesson highlight

#### Lesson Viewer
- Clean reading layout
- Rich content display
- File attachments list
- Download buttons
- Mark complete button
- Previous/Next navigation

#### Progress Tracking
- Personal progress dashboard
- Completed lessons list
- Resume functionality

### 10.3 Routing Structure

```typescript
// Admin Routes
/admin
/admin/dashboard
/admin/courses
/admin/courses/create
/admin/courses/:id/edit
/admin/courses/:id/structure
/admin/lessons/:id/edit
/admin/assignments
/admin/progress

// Learner Routes
/learn
/learn/courses
/learn/courses/:id
/learn/lessons/:id
```

### 10.4 Component Architecture

```
src/app/
├── core/
│   ├── auth/
│   ├── guards/
│   └── interceptors/
├── shared/
│   ├── components/
│   └── services/
├── admin/
│   ├── courses/
│   ├── lessons/
│   ├── assignments/
│   └── progress/
└── learner/
    ├── my-courses/
    ├── lesson-viewer/
    └── progress/
```

---

## 11. Non-Functional Requirements

### 11.1 Performance
- **Target Users:** 10-100 concurrent users
- **Response Time:** < 2 seconds for page loads
- **File Upload:** Progress indicator for large files
- **Optimized for:** Internal network usage

### 11.2 Security (Minimal - Internal Use)
- Authentication required for all routes
- Role-based authorization
- Token-based sessions
- **NOT Required:**
  - Advanced encryption
  - Rate limiting
  - Antivirus scanning
  - CSRF protection (handled by Laravel)

### 11.3 Usability
- Clean and intuitive UI
- Responsive design (desktop-first)
- Clear navigation
- Helpful error messages
- Loading indicators

### 11.4 Maintainability
- Clean code architecture
- API separation (backend/frontend)
- Modular components
- Code documentation
- Environment configuration

### 11.5 Scalability
- Database indexing on foreign keys
- Pagination for large lists
- Lazy loading of course content
- Efficient file storage structure

---

## 12. Explicitly Out of Scope (NOT Required)

❌ Public access or guest users  
❌ Payment processing  
❌ Certificates or badges  
❌ SCORM or LMS standards  
❌ Exams, quizzes, or proctoring (MVP)  
❌ Email notifications  
❌ Mobile native app  
❌ Advanced analytics dashboard  
❌ Social features (comments, likes)  
❌ Live video streaming  
❌ Multi-language support  
❌ Strict file validation/antivirus  
❌ SSO integration  

---

## 13. Future Enhancements (Optional)

### Phase 2 Features
- 🔄 Drag & drop ordering for lessons
- 💾 Auto-save lesson content
- 📊 Quiz module with scoring
- 🔍 Search functionality
- 🏷️ Tags and filtering
- 📈 Analytics dashboard
- 🔔 Email notifications
- 📱 Mobile responsive optimization
- 🎥 Video player integration
- 📅 Scheduled course releases

---

## 14. Definition of Done (MVP)

**MVP is complete when:**

✅ Admin can:
- Create complete training courses
- Organize content with categories
- Write rich text lessons
- Upload images inline
- Attach any files to lessons
- Assign courses to learners
- View learner progress

✅ Learner can:
- View assigned courses
- Navigate through training content
- Read lessons with images
- Download attachments
- Mark lessons as completed
- Track personal progress
- Resume from last lesson

✅ System can:
- Authenticate users securely
- Store all content persistently
- Handle file uploads reliably
- Track progress accurately
- Provide responsive UI

---

## 15. Development Phases

### Phase 1: Foundation (Week 1-2)
- Setup monorepo structure
- Laravel backend scaffolding
- Database schema & migrations
- Angular frontend scaffolding
- Authentication implementation

### Phase 2: Core Features (Week 3-4)
- Course CRUD operations
- Category management
- Lesson CRUD operations
- Basic UI components

### Phase 3: Content Editor (Week 5)
- CKEditor integration
- Image upload functionality
- File attachment system
- Content preview

### Phase 4: Learner Experience (Week 6)
- Course navigation
- Lesson viewer
- Progress tracking
- Resume functionality

### Phase 5: Testing & Polish (Week 7-8)
- End-to-end testing
- Bug fixes
- UI/UX improvements
- Documentation

---

## 16. Technical Decisions

### 16.1 Why Laravel?
- Robust ORM (Eloquent)
- Built-in authentication (Sanctum)
- File storage abstraction
- Clean API development
- Large community support

### 16.2 Why Angular?
- TypeScript type safety
- Component-based architecture
- Powerful routing
- Reactive forms
- Enterprise-grade framework

### 16.3 Why CKEditor 5?
- Best-in-class WYSIWYG editor
- Excellent image handling
- Angular integration available
- Customizable toolbar
- Active maintenance

### 16.4 Why Monorepo?
- Simplified development workflow
- Shared configuration
- Easier deployment
- Single version control
- Coordinated releases

---

## 17. Success Metrics

**Project Success Indicators:**
- Admin can create a full course in < 30 minutes
- Learner can complete a course without confusion
- Zero data loss during content creation
- Smooth file uploads up to 100MB
- Responsive UI on desktop browsers
- Easy to onboard new developers

---

## 18. Support & Maintenance

**Post-MVP:**
- Internal support only
- Bug fixes as needed
- Feature requests evaluated quarterly
- No 24/7 support required

---

## Appendix A: API Response Formats

### Success Response
```json
{
  "success": true,
  "data": { /* ... */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": { /* ... */ }
  }
}
```

---

## Appendix B: File Naming Conventions

**Backend (Laravel):**
- Controllers: `CourseController.php`
- Models: `Course.php`
- Migrations: `2026_01_06_create_courses_table.php`

**Frontend (Angular):**
- Components: `course-list.component.ts`
- Services: `course.service.ts`
- Models: `course.model.ts`

---

**Document End**

*This document serves as the single source of truth for the Training Center Web App development.*
