<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Achievement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    /**
     * Fetch all students ordered by name.
     */
    public function index()
    {
        $students = Student::orderBy('name', 'asc')->get();
        return response()->json($students);
    }

    /**
     * Store a new student (helper endpoint for setup).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'avatar_url' => 'nullable|string|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $student = Student::create([
            'name' => $request->name,
            'avatar_url' => $request->avatar_url ?: '/avatars/boy1.png',
            'total_score' => 0,
        ]);

        return response()->json($student, 201);
    }

    /**
     * Update student score.
     */
    public function updateScore(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'points' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $student = Student::findOrFail($id);
        $points = (int) $request->points;

        $student->total_score += $points;
        $student->save();

        return response()->json([
            'message' => 'Score updated successfully',
            'student' => $student,
        ]);
    }

    /**
     * Save a new individual achievement, upload the image, store stars, points,
     * and update the student's total score.
     */
    public function addAchievement(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'description' => 'required|string',
            'image' => 'nullable|image|max:10240', // support up to 10MB
            'stars_count' => 'required|integer|min:1|max:5',
            'points_awarded' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $student = Student::findOrFail($id);

        $imageUrl = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('achievements', 'public');
            $imageUrl = Storage::url($path);
        }

        $achievement = null;
        DB::transaction(function () use ($student, $request, $imageUrl, &$achievement) {
            $points = (int) $request->points_awarded;

            $achievement = Achievement::create([
                'student_id' => $student->id,
                'description' => $request->description,
                'image_url' => $imageUrl,
                'stars_count' => (int) $request->stars_count,
                'points_awarded' => $points,
            ]);

            $student->total_score += $points;
            $student->save();
        });

        return response()->json([
            'message' => 'Achievement saved successfully and score updated',
            'achievement' => $achievement,
            'student' => $student,
        ], 201);
    }

    /**
     * Fetch students ordered by total score descending to display ranks.
     */
    public function leaderboard()
    {
        $leaderboard = Student::orderBy('total_score', 'desc')
            ->orderBy('name', 'asc') // tie breaker
            ->get();
        return response()->json($leaderboard);
    }

    /**
     * Reset leaderboard scores and wipe achievements.
     */
    public function resetLeaderboard()
    {
        DB::transaction(function () {
            Student::query()->update(['total_score' => 0]);
            Achievement::query()->delete();
        });

        return response()->json([
            'message' => 'Leaderboard has been reset successfully',
        ]);
    }
}
