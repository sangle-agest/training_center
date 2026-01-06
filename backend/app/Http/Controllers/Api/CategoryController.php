<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::with(['course', 'parent']);
        
        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }
        
        $categories = $query->orderBy('order')->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'parent_id' => 'nullable|exists:categories,id',
            'name' => 'required|string|max:255',
            'order' => 'integer',
        ]);

        $category = Category::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $category,
            'message' => 'Category created successfully',
        ], 201);
    }

    public function show(string $id)
    {
        $category = Category::with(['course', 'parent', 'children', 'lessons'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'parent_id' => 'nullable|exists:categories,id',
            'name' => 'string|max:255',
            'order' => 'integer',
        ]);

        $category->update($request->only(['parent_id', 'name', 'order']));

        return response()->json([
            'success' => true,
            'data' => $category,
            'message' => 'Category updated successfully',
        ]);
    }

    public function destroy(string $id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully',
        ]);
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:categories,id',
            'categories.*.order' => 'required|integer',
        ]);

        foreach ($request->categories as $item) {
            Category::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Categories reordered successfully',
        ]);
    }
}
