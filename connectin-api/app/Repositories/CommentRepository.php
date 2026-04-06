<?php

namespace App\Repositories;

use App\Interfaces\CommentRepositoryInterface;
use App\Models\Comment;

class CommentRepository implements CommentRepositoryInterface 
{
    // Récupérer tous les commentaires du site (modération)
    public function all() 
    {
        return Comment::with(['user', 'post'])->latest()->get();
    }

    // Trouver un commentaire spécifique
    public function find(int $id) 
    {
        return Comment::findOrFail($id);
    }

    // Récupérer les commentaires d'un post avec les infos de l'auteur
    public function getByPost(int $postId) 
    {
        return Comment::where('post_id', $postId)
                      ->with('user') // Pour afficher qui a écrit le commentaire
                      ->oldest()     // On affiche les plus vieux en premier (fil de discussion)
                      ->get();
    }

    // CREATE : Ajouter un commentaire
    public function create(array $data) 
    {
        return Comment::create([
            'content' => $data['content'],
            'user_id' => $data['user_id'],
            'post_id' => $data['post_id']
        ]);
    }

    // UPDATE : Modifier le texte d'un commentaire
    public function update(int $id, array $data) 
    {
        $comment = Comment::findOrFail($id);
        $comment->update([
            'content' => $data['content']
        ]);
        return $comment;
    }

    // DELETE : Supprimer
    public function delete(int $id) 
    {
        return Comment::destroy($id);
    }
}