<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\LessonProgress;
use App\Models\CourseAssignment;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    public function toggleLessonProgress(Request $request, $lessonId)
    {
        $lesson = Lesson::findOrFail($lessonId);

        $progress = LessonProgress::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'lesson_id' => $lesson->id,
            ],
            [
                'completed' => $request->input('completed', true),
                'completed_at' => $request->input('completed', true) ? now() : null,
            ]
        );

        return response()->json([
            'success' => true,
            'data' => $progress,
            'message' => 'Lesson progress updated',
        ]);
    }

    public function getCourseProgress($courseId)
    {
        $course = Course::with(['categories.lessons'])->findOrFail($courseId);
        $user = auth()->user();

        $allLessons = [];
        foreach ($course->categories as $category) {
            foreach ($category->lessons as $lesson) {
                $allLessons[] = $lesson->id;
            }
        }

        $completedLessons = LessonProgress::where('user_id', $user->id)
            ->whereIn('lesson_id', $allLessons)
            ->where('completed', true)
            ->count();

        $totalLessons = count($allLessons);
        $percentage = $totalLessons > 0 ? ($completedLessons / $totalLessons) * 100 : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'total_lessons' => $totalLessons,
                'completed_lessons' => $completedLessons,
                'percentage' => round($percentage, 2),
            ],
        ]);
    }

    public function getMyCourses(Request $request)
    {
        $user = $request->user();
        
        $assignments = CourseAssignment::with(['course.categories.lessons'])
            ->where('user_id', $user->id)
            ->get();

        $courses = $assignments->map(function ($assignment) use ($user) {
            $course = $assignment->course;
            
            $allLessons = [];
            foreach ($course->categories as $category) {
                foreach ($category->lessons as $lesson) {
                    $allLessons[] = $lesson->id;
                }
            }

            $completedLessons = LessonProgress::where('user_id', $user->id)
                ->whereIn('lesson_id', $allLessons)
                ->where('completed', true)
                ->count();

            $totalLessons = count($allLessons);
            $percentage = $totalLessons > 0 ? ($completedLessons / $totalLessons) * 100 : 0;

            $course->progress = [
                'total_lessons' => $totalLessons,
                'completed_lessons' => $completedLessons,
                'percentage' => round($percentage, 2),
            ];

            return $course;
        });

        return response()->json([
            'success' => true,
            'data' => $courses,
        ]);
    }
}
