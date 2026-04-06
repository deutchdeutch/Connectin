<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    // Autoriser le remplissage de ces colonnes
    protected $fillable = ['content','user_id', 'post_id','image_path'];// variable relative à un poste un texte, une image si necessaire et un utilisateur spécifique
     // Accesseur : transforme automatiquement image_path en URL complète
    public function getImagePathAttribute($value)
    {
        if (!$value) {
            return null;
        }

        // Si l'URL est déjà complète (commence par http), la retourner telle quelle
        if (str_starts_with($value, 'http')) {
            return $value;
        }

        // Sinon, construire l'URL complète
        return asset('storage/' . $value);
    }
     // un post est associé à un utilisateur specifique , son commentaire et son like
    public function user() {
        return $this->belongsTo(User::class);
    }

    public function comments() {
        return $this->hasMany(Comment::class);
    }

    public function likes() {
        return $this->hasMany(Like::class);
    }
}
