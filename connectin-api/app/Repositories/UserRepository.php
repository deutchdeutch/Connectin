<?php

namespace App\Repositories;

use App\Interfaces\UserRepositoryInterface;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserRepository implements UserRepositoryInterface 
{
    public function all() // pour tous les users 
    {
        return User::all();
    }

    public function find(int $id) // pour un user specifique
    {
        return User::findOrFail($id);
    }

    public function findByEmail(string $email) 
    {
        return User::where('email', $email)->first(); // first permet de renvoyer directement l'objet dans ce cas l'user rattacher au mail
    }

    public function create(array $data) 
    {
        return User::create([
            'first_name' => $data['first_name'],
            'last_name'  => $data['last_name'],
            'email'      => $data['email'],
            'password'   => Hash::make($data['password']),
            'is_connected' => 0, // Par défaut à l'inscription
        ]);
    }

    public function update(int $id, array $data) 
    {
        $user = User::findOrFail($id); // findOrFail permet de verifier l'existence; s'il existe la fonction continue s'il n'existe pas retourne automatiquement une erreur 
        
        // Si un nouveau mot de passe est fourni, on le hache
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        
        $user->update($data);
        return $user;
    }

    public function delete(int $id) // supprimer l'utilisateur  avec  tous les likes et les commentaires associés
    {
        return User::destroy($id);
    }

    public function updateStatus(int $id, int $status) // permet de vérifier le stautus de connection 
    {
        return User::where('id', $id)->update(['is_connected' => $status]);
    }
}