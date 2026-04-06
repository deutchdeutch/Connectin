<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{    // pour un commentaire necessite un utilisateur spécifique et son post associé
     protected $fillable = ['content', 'user_id', 'post_id'];

    public function user(){
        return $this->belongsTo(User::class);//ici on utilise belongsTo car le commentaire appartient à un seul user
    } 
    public function post(){
        return $this->belongsTo(Post::class);// pareil ici 
    }
}
