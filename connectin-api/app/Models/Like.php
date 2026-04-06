<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Like extends Model
{     // pour un like necessite un utilisateur spécifique et son post associé
      protected $fillable = ['user_id', 'post_id'];
    // on appel les fonctions user et post car le like est associer et un post et user précis
    public function user(){
        return $this->belongsTo(User::class);// on utlise ici belongsTo car le like est associé à un user défini
    }

    public function posts(){
        return $this->belongsTo(Post::class); // pareil pour le post 
    }
}
