<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseAssignment;
use App\Models\User;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    public function assignCourse(Request $request, $courseId)
    {
        $course = Course::findOrFail($courseId);

        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $assignments = [];
        foreach ($request->user_ids as $userId) {
            $assignment = CourseAssignment::updateOrCreate(
                [
                    'course_id' => $course->id,
                    'user_id' => $userId,
                ],
                [
                    'assigned_by' => $request->user()->id,
                    'assigned_at' => now(),
                ]
            );
            $assignments[] = $assignment;
        }

        return response()->json([
            'success' => true,
            'data' => $assignments,
            'message' => 'Course assigned successfully',
        ]);
    }

    public function unassignCourse($courseId, $userId)
    {
        $assignment = CourseAssignment::where('course_id', $courseId)
            ->where('user_id', $userId)
            ->firstOrFail();

        $assignment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Course unassigned successfully',
        ]);
    }

    public function getCourseLearners($courseId)
    {
        $course = Course::findOrFail($courseId);
        $assignments = CourseAssignment::with(['user', 'assignedBy'])
            ->where('course_id', $courseId)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $assignments,
        ]);
    }
}
