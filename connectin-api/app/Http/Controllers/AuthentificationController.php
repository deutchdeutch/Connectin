<?php
// AuthentificationController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use App\Interfaces\UserRepositoryInterface;

class AuthentificationController extends Controller
{
    public function __construct(private UserRepositoryInterface $users)
    {
    }

    // création d'un nouveau utilisateur
    public function register(Request $request){
        //Log::info('REGISTER DATA:', $request->all());
        // validation de l'utilisateur
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
        ]);

        // creation d'utilisateur
        $user = $this->users->create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => $request->password,
        ]);

        // On génère la clé de connexion (le Token)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Utilisateur créé avec succès !',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    // la fonction de vérification. Son rôle est de reconnaître un utilisateur qui existe déjà.
    public function login(Request $request){
        //Log::info('LOGIN DATA:', $request->all());
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        $user = $this->users->findByEmail($request->email);

        if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'message' => 'Identifiants incorrects'
        ], 401);
        }

         $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
        'message' => 'Connexion réussie',
        'access_token' => $token,
        'token_type' => 'Bearer',
        'user' => $user
    ], 200);
    }


    // fonction de deconnection
    public function logout(Request $request){
        
        // récupérer l'user connecter
        $user = $request->user();

        // suprimer les token
        $user->tokens()->delete();

        // message json de confirmation
        return response()->json(['message' => 'Utilisateur déconnecté avec succès !'], 200);
   
    }
    
}