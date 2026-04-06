<?php

namespace App\Interfaces;

interface CommentRepositoryInterface 
{
    public function all();                          // READ (Tous les commentaires)
    public function find(int $id);                 // READ (Un commentaire précis)
    public function getByPost(int $postId);         // READ (Tous les commentaires d'un post)
    public function create(array $data);            // CREATE (Commenter)
    public function update(int $id, array $data);   // UPDATE (Modifier son texte)
    public function delete(int $id);                // DELETE (Supprimer un commentaire)
}