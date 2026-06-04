<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'name',
        'avatar_url',
        'total_score',
    ];

    public function achievements()
    {
        return $this->hasMany(Achievement::class);
    }
}
