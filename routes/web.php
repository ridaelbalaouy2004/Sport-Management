<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SportController;
use App\Http\Controllers\EquipeController;
use App\Http\Controllers\JoueurController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Hash;

Route::middleware('auth')->group(function (){

    Route::get('/', function () {
        return view('welcome');
    });

    Route::resource('sports', SportController::class);
    Route::resource('equipes', EquipeController::class);
    Route::resource('joueurs', JoueurController::class);
    Route::resource('matchs', MatchController::class);
    Route::put('/matchs/{id}/score', [MatchController::class, 'updateScore'])->name('matchs.updateScore');
    Route::get('/classement', [App\Http\Controllers\MatchController::class, 'classement'])->name('matchs.classement');
    Route::post('/logout', [AuthController::class,'logout'])->name('logout');
});

Route::middleware('guest')->group(function () {
    Route::controller(AuthController::class)->group(function () {
        Route::get('/login', 'loginPage')->name('loginPage');
        Route::post('/login', 'authenticate')->name('login');
    });
});

// Route::get('/hash',function(){
//     return Hash::make('12345678');
// });