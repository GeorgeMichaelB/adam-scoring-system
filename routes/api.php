<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/students', [StudentController::class, 'index']);
Route::post('/students', [StudentController::class, 'store']);
Route::post('/students/{id}/score', [StudentController::class, 'updateScore']);
Route::post('/students/{id}/achievements', [StudentController::class, 'addAchievement']);
Route::get('/leaderboard', [StudentController::class, 'leaderboard']);
Route::post('/leaderboard/reset', [StudentController::class, 'resetLeaderboard']);
