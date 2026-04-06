<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Carbon;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void // cette fonction joue le role de pont entre Interface et Repositories
    {
    $this->app->bind(\App\Interfaces\UserRepositoryInterface::class, \App\Repositories\UserRepository::class);
    $this->app->bind(\App\Interfaces\PostRepositoryInterface::class, \App\Repositories\PostRepository::class);
    $this->app->bind(\App\Interfaces\LikeRepositoryInterface::class, \App\Repositories\LikeRepository::class);
    $this->app->bind(\App\Interfaces\CommentRepositoryInterface::class, \App\Repositories\CommentRepository::class);

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void // cette fonction permet à gerer les autorisations de l'utilisateur
    {
        
        Gate::define('update-post', function ($user, $post) {
        return $user->id === $post->user_id;
    });
    //  Afficher les dates en français (ex: "il y a 2 minutes")
        Carbon::setLocale('fr');
    }
}
