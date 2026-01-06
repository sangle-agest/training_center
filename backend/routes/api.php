<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\LessonController;
use App\Http\Controllers\Api\FileUploadController;
use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\ProgressController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Admin routes
    Route::middleware('role:admin')->group(function () {
        // Courses
        Route::apiResource('courses', CourseController::class);
        Route::get('/courses/{id}/tree', [CourseController::class, 'tree']);

        // Categories
        Route::apiResource('categories', CategoryController::class);
        Route::post('/categories/reorder', [CategoryController::class, 'reorder']);

        // Lessons
        Route::apiResource('lessons', LessonController::class);

        // File uploads
        Route::post('/upload/image', [FileUploadController::class, 'uploadImage']);
        Route::post('/lessons/{id}/files', [FileUploadController::class, 'uploadLessonFile']);
        Route::get('/lessons/{id}/files', [FileUploadController::class, 'getLessonFiles']);
        Route::delete('/files/{id}', [FileUploadController::class, 'deleteFile']);

        // Assignments
        Route::post('/courses/{id}/assign', [AssignmentController::class, 'assignCourse']);
        Route::delete('/courses/{courseId}/unassign/{userId}', [AssignmentController::class, 'unassignCourse']);
        Route::get('/courses/{id}/learners', [AssignmentController::class, 'getCourseLearners']);
    });

    // Learner routes
    Route::middleware('role:learner')->group(function () {
        // My courses
        Route::get('/progress/my-courses', [ProgressController::class, 'getMyCourses']);
        Route::get('/progress/course/{id}', [ProgressController::class, 'getCourseProgress']);
        
        // View course content
        Route::get('/courses/{id}', [CourseController::class, 'show']);
        Route::get('/courses/{id}/tree', [CourseController::class, 'tree']);
        Route::get('/lessons/{id}', [LessonController::class, 'show']);
        Route::get('/lessons/{id}/files', [FileUploadController::class, 'getLessonFiles']);
        
        // Download files
        Route::get('/files/{id}/download', [FileUploadController::class, 'downloadFile']);
        
        // Progress tracking
        Route::post('/progress/lesson/{id}', [ProgressController::class, 'toggleLessonProgress']);
    });

    // Shared routes (both admin and learner)
    Route::get('/files/{id}/download', [FileUploadController::class, 'downloadFile']);
});

