<?php

namespace App\Repositories;

use App\Interfaces\LikeRepositoryInterface;
use App\Models\Like;

class LikeRepository implements LikeRepositoryInterface 
{
    // Récupérer tous les likes (utile pour des stats d'admin)
    public function all() 
    {
        return Like::all();
    }

    // Trouver un like par son ID
    public function find(int $id) 
    {
        return Like::findOrFail($id);
    }

    // Récupérer tous les likes d'un post spécifique
    public function getByPost(int $postId) 
    {
        return Like::where('post_id', $postId)->get();
    }

    // CREATE : Ajouter un like
    public function create(array $data) 
    {
        // Sécurité : on vérifie si le like existe déjà pour éviter les erreurs SQL
        // même si ta base de données a une UNIQUE KEY, c'est plus propre de vérifier en PHP
        $exists = Like::where('post_id', $data['post_id'])
                      ->where('user_id', $data['user_id'])
                      ->exists();

        if (!$exists) {
            return Like::create([
                'post_id' => $data['post_id'],
                'user_id' => $data['user_id']
            ]);
        }
        
        return null; // Ou renvoyer le like existant
    }

    // DELETE : Supprimer par ID de la table likes
    public function delete(int $id) 
    {
        return Like::destroy($id);
    }

    // DELETE : La version la plus utilisée (supprimer le like d'un utilisateur sur un post)
    public function deleteSpecific(int $postId, int $userId) 
    {
        return Like::where('post_id', $postId)
                   ->where('user_id', $userId)
                   ->delete();
    }
}