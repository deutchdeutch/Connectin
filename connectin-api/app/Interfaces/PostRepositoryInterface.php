<?php

namespace App\Interfaces;

interface PostRepositoryInterface 
{

   public function all();                         // READ (tous)
    public function find(int $id);                // READ (un seul)
    public function create(array $data);           // CREATE
    public function update(int $id, array $data);  // UPDATE
    public function delete(int $id);               // DELETE
}