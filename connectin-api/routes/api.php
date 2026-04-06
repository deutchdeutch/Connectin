<?php
// api.php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthentificationController;
use App\Http\Controllers\MessageController;

//  ROUTES PUBLIQUES (Accessibles sans token)
Route::post('/register', [AuthentificationController::class, 'register']);
Route::post('/login', [AuthentificationController::class, 'login']);
// ROUTES PROTÉGÉES (Nécessitent un token)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// --- LA PARTIE À AJOUTER ---
// Cette route répond à GET /api/ping
Route::get('/ping', function () {
    return response()->json([
        'message' => 'L\'API fonctionne !'
    ]);
});


// pour l'authentifiction de l'utilisateur
Route::post('/register', [AuthentificationController::class, 'register']);
Route::post('/login', [AuthentificationController::class, 'login']);

// routes vers les fonctions des controllers
Route::middleware('auth:sanctum')->group(function () {
    // pour l'authentification   
    Route::get('/user', fn() => request()->user());
    Route::post('/logout', [AuthentificationController::class, 'logout']);

    // pour les utilisateurs
    Route::get('/users/search', [UserController::class, 'search']); //  RECHERCHE
    Route::post('/users', [UserController::class, 'add']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::post('/users/{id}', [UserController::class, 'update']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'delete']);


    // pour les posts
    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'add']); 
    Route::get('/posts/{id}', [PostController::class, 'show']);
    Route::put('/posts/{id}', [PostController::class, 'update']);
    Route::delete('/posts/{id}', [PostController::class, 'delete']);

    // pour les commentaires
    Route::post('/comments', [CommentController::class, 'save']);
    Route::put('/comments/{id}', [CommentController::class, 'update']); 
    Route::delete('/comments/{id}', [CommentController::class, 'delete']); 

    // pour les likes
    Route::post('/likes', [LikeController::class, 'save']);
    Route::delete('/likes/{id}', [LikeController::class, 'delete']);
    Route::get('/likes', [LikeController::class, 'index']);

// pour les messages

    Route::middleware('auth:sanctum')->group(function () {
    Route::get('/messages/{receiver_id}', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);

});
});