<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    /**
     * Récupérer tous les messages entre l'utilisateur connecté et un autre utilisateur.
     */
    public function index($receiver_id)
    {
        $auth_id = Auth::id(); // Ton ID (celui qui est connecté)

        // On cherche les messages où :
        // (Moi suis l'expéditeur ET Lui le receveur) 
        // OU (Lui est l'expéditeur ET Moi le receveur)
        $messages = Message::where(function($query) use ($auth_id, $receiver_id) {
            $query->where('sender_id', $auth_id)
                  ->where('receiver_id', $receiver_id);
        })
        ->orWhere(function($query) use ($auth_id, $receiver_id) {
            $query->where('sender_id', $receiver_id)
                  ->where('receiver_id', $auth_id);
        })
        ->orderBy('created_at', 'asc') // Du plus vieux au plus récent
        ->get();

        return response()->json($messages);
    }

    /**
     * Enregistrer un nouveau message dans la base de données.
     */
    public function store(Request $request)
    {
        //  Validation des données reçues de React
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content'     => 'required|string',
        ]);

        //  Création du message
        $message = Message::create([
            'sender_id'   => Auth::id(), // L'expéditeur est toujours l'utilisateur connecté
            'receiver_id' => $request->receiver_id,
            'content'     => $request->content,
        ]);

        //  On renvoie le message créé pour que React puisse l'afficher de suite
        return response()->json($message);
    }
}