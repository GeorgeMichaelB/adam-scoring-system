<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    protected $fillable = [
        'student_id',
        'description',
        'image_url',
        'stars_count',
        'points_awarded',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
