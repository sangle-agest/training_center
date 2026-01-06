<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\Request;

class LessonController extends Controller
{
    public function index(Request $request)
    {
        $query = Lesson::with(['category']);
        
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        
        $lessons = $query->orderBy('order')->get();

        return response()->json([
            'success' => true,
            'data' => $lessons,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'order' => 'integer',
        ]);

        $lesson = Lesson::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $lesson,
            'message' => 'Lesson created successfully',
        ], 201);
    }

    public function show(string $id)
    {
        $lesson = Lesson::with(['category', 'files'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $lesson,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $lesson = Lesson::findOrFail($id);

        $request->validate([
            'title' => 'string|max:255',
            'content' => 'nullable|string',
            'order' => 'integer',
        ]);

        $lesson->update($request->only(['title', 'content', 'order']));

        return response()->json([
            'success' => true,
            'data' => $lesson,
            'message' => 'Lesson updated successfully',
        ]);
    }

    public function destroy(string $id)
    {
        $lesson = Lesson::findOrFail($id);
        $lesson->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lesson deleted successfully',
        ]);
    }
}
