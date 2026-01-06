<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Category;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::with('creator')->get();

        return response()->json([
            'success' => true,
            'data' => $courses,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $course = Course::create([
            'title' => $request->title,
            'description' => $request->description,
            'is_active' => $request->is_active ?? true,
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'data' => $course,
            'message' => 'Course created successfully',
        ], 201);
    }

    public function show(string $id)
    {
        $course = Course::with(['creator', 'categories.lessons'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $course,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $course = Course::findOrFail($id);

        $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $course->update($request->only(['title', 'description', 'is_active']));

        return response()->json([
            'success' => true,
            'data' => $course,
            'message' => 'Course updated successfully',
        ]);
    }

    public function destroy(string $id)
    {
        $course = Course::findOrFail($id);
        $course->delete();

        return response()->json([
            'success' => true,
            'message' => 'Course deleted successfully',
        ]);
    }

    public function tree(string $id)
    {
        $course = Course::with(['categories' => function ($query) {
            $query->whereNull('parent_id')
                ->with(['children.lessons', 'lessons'])
                ->orderBy('order');
        }])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $course,
        ]);
    }
}

