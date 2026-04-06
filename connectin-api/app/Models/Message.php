<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory; // Optionnel mais recommandé
use Illuminate\Database\Eloquent\Model;
// use App\Models\Message;


class Message extends Model
{
    use HasFactory;

    // Cette ligne est LA PLUS IMPORTANTE
    // Elle autorise l'enregistrement de ces données en base
    protected $fillable = [
        'sender_id', 
        'receiver_id', 
        'content'
    ];

    /**
     * Relation : récupère l'utilisateur qui a envoyé le message
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Relation : récupère l'utilisateur qui reçoit le message
     */
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}