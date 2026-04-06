<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'is_connected',
        'profile_photo_path',
        'bio',
    ]; // ce sont les veriables necessitant l'accès à un utilisateur

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    // permet de vérifier l'etat si l'utilisateur est connecté ou pas 
    protected $casts = [
        'is_connected' => 'boolean'
    ];
    protected $appends = [
        'full_name', 
        'profile_photo_url'
        ]; // permet de gerer la gestion de photo de profil 

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    //  un utilisateur peut faire plusieurs posts
    public function posts()
    {
        return $this->hasMany(Post::class);  // hasMany ici car l'utilisateur peut effectuer plusieurs post
    }
    // l'utilisateur peut faire plusieurs commentaires  
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    // l'utilisateur peut faire plusieurs likes 
    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function getFullNameAttribute()
    {
        // On retire les espaces inutiles au cas où un champ est vide
        $fullName = trim("{$this->first_name} {$this->last_name}");
        return $fullName ?: "Utilisateur supprimé"; 
        
    }
    // Ajoute cette fonction pour avoir l'URL de la photo directement
    public function getProfilePhotoUrlAttribute()
    {
        return $this->profile_photo_path
            ? asset('storage/' . $this->profile_photo_path)
            : "https://ui-avatars.com/api/?name=" . urlencode($this->full_name);
        // Si pas de photo, génère un avatar avec les initiales
    }
}
