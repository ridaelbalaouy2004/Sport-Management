<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiAuthController;
use App\Http\Controllers\Api\SportApiController;
use App\Http\Controllers\Api\TeamApiController;
use App\Http\Controllers\Api\PlayerApiController;
use App\Http\Controllers\Api\MatchApiController;
use App\Http\Controllers\Api\ResultApiController;
use App\Http\Controllers\Api\RankingApiController;
use App\Http\Controllers\Api\UserApiController;
use App\Http\Controllers\Api\DashboardApiController;

// ── Public Auth Routes ──────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/register', [ApiAuthController::class, 'register']);
    Route::post('/login',    [ApiAuthController::class, 'login']);
});

// ── Protected Routes (Sanctum) ──────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [ApiAuthController::class, 'logout']);
        Route::get('/me',      [ApiAuthController::class, 'me']);
    });

    // Dashboard
    Route::get('/dashboard/stats', [DashboardApiController::class, 'stats']);
    Route::get('/dashboard/chart', [DashboardApiController::class, 'chart']);

    // Sports
    Route::apiResource('sports', SportApiController::class);

    // Teams
    Route::apiResource('teams', TeamApiController::class);

    // Players
    Route::apiResource('players', PlayerApiController::class);

    // Matches
    Route::apiResource('matches', MatchApiController::class);

    // Results
    Route::get('/results',         [ResultApiController::class, 'index']);
    Route::post('/results',        [ResultApiController::class, 'store']);
    Route::get('/results/{id}',    [ResultApiController::class, 'show']);
    Route::put('/results/{id}',    [ResultApiController::class, 'update']);
    Route::delete('/results/{id}', [ResultApiController::class, 'destroy']);

    // Rankings
    Route::get('/rankings',      [RankingApiController::class, 'index']);
    Route::post('/rankings',     [RankingApiController::class, 'store']);
    Route::put('/rankings/{id}', [RankingApiController::class, 'update']);

    // ── Admin-only ───────────────────────────────────────────────────────────
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserApiController::class);
    });
});
