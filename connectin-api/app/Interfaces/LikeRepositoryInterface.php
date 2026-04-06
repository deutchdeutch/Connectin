<?php

namespace App\Interfaces;

interface LikeRepositoryInterface 
{
    public function all();                                  // READ (Tous les likes du site)
    public function find(int $id);                         // READ (Un like précis)
    public function getByPost(int $postId);                // READ (Tous les likes d'un post)
    public function create(array $data);                   // CREATE (Liker)
    public function delete(int $id);                       // DELETE (Enlever un like par son ID)
    public function deleteSpecific(int $postId, int $userId); // DELETE (Enlever le like d'un utilisateur)
}