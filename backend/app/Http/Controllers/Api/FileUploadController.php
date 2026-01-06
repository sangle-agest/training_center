<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\LessonFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadController extends Controller
{
    public function uploadImage(Request $request)
    {
        $request->validate([
            'upload' => 'required|image|max:10240',
        ]);

        $file = $request->file('upload');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('public/lessons/images', $filename);

        $url = Storage::url($path);

        return response()->json([
            'uploaded' => true,
            'url' => $url,
        ]);
    }

    public function uploadLessonFile(Request $request, $lessonId)
    {
        $lesson = Lesson::findOrFail($lessonId);

        $request->validate([
            'file' => 'required|file|max:102400',
        ]);

        $file = $request->file('file');
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('public/lessons/files', $filename);

        $lessonFile = LessonFile::create([
            'lesson_id' => $lesson->id,
            'filename' => $filename,
            'original_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
            'uploaded_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $lessonFile,
            'message' => 'File uploaded successfully',
        ], 201);
    }

    public function getLessonFiles($lessonId)
    {
        $lesson = Lesson::findOrFail($lessonId);
        $files = $lesson->files;

        return response()->json([
            'success' => true,
            'data' => $files,
        ]);
    }

    public function deleteFile($fileId)
    {
        $file = LessonFile::findOrFail($fileId);
        
        if (Storage::exists($file->file_path)) {
            Storage::delete($file->file_path);
        }
        
        $file->delete();

        return response()->json([
            'success' => true,
            'message' => 'File deleted successfully',
        ]);
    }

    public function downloadFile($fileId)
    {
        $file = LessonFile::findOrFail($fileId);
        
        if (!Storage::exists($file->file_path)) {
            abort(404, 'File not found');
        }

        return Storage::download($file->file_path, $file->original_name);
    }
}
