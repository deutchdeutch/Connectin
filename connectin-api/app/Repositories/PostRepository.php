<?php

namespace App\Repositories;

use App\Interfaces\PostRepositoryInterface;
use App\Models\Post;

class PostRepository implements PostRepositoryInterface 
{
    public function all() { // permet de d'afficher tous les posts liés à un utilisateur et son commentaire, également compter les commentaires et likes qui sont associées 
        return Post::with(['user', 'comments.user', 'likes'])->withCount(['comments', 'likes'])->latest()->get();
    }

    public function find(int $id) { // permet d'afficher un post lié à un utilisateur specifique
        return Post::findOrFail($id);
    }

    public function create(array $data) { // permet de créer  un post 
        return Post::create($data);
    }

    public function update(int $id, array $data) { // permet de modifier un post 
        $post = Post::findOrFail($id);
        $post->update($data);
        return $post;
    }

    public function delete(int $id) { // supprimer un post et les commenatires associés au post
        return Post::destroy($id);
    }
}