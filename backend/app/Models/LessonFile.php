<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonFile extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'lesson_id',
        'filename',
        'original_name',
        'file_path',
        'file_size',
        'mime_type',
        'uploaded_at',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }
}
